import { prisma } from '@celluloid/prisma';
import type { Annotation } from '@celluloid/prisma';
import { Prisma } from '@celluloid/prisma';
import { formatTimeFromSeconds, toSrt } from '@celluloid/utils';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'node:events';
import { parse as toXML } from 'js2xmlparser';
import Papa from 'papaparse';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import { protectedProcedure, publicProcedure, router } from '../trpc';


// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  role: true,
  initial: true,
  color: true,
  avatar: {
    select: {
      id: true,
      //@ts-expect-error dynamic
      publicUrl: true,
      path: true
    }
  }
});


export const annotationRouter = router({
  byProjectId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const annotations = await prisma.annotation.findMany({
        where: { projectId: id, detection: null },
        include: {
          comments: {
            include: {
              user: {
                select: defaultUserSelect
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          user: {
            select: defaultUserSelect
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      // if (!project) {
      //   throw new TRPCError({
      //     code: 'NOT_FOUND',
      //     message: `No project with id '${id}'`,
      //   });
      // }
      return annotations;
    }),
  onChange: publicProcedure.subscription(() => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Annotation>((emit) => {
      const onChange = (data: Annotation) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on('change', onChange);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('change', onChange);
      };
    });
  }),
  add: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        startTime: z.number(),
        stopTime: z.number(),
        pause: z.boolean(),
        projectId: z.string(),
        extra: z.any(),
        emotion: z.string().optional(),
        mode: z.enum(["performance", "analysis"]).optional(),
        concept: z.string().optional(),
        detection: z.enum(["auto", "auto/reco/me", "auto/reco/allusers"]).optional()
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.id) {
        const annotation = await prisma.annotation.create({
          data: {
            userId: ctx.user?.id,
            text: input.text,
            startTime: input.startTime,
            stopTime: input.stopTime,
            pause: input.pause,
            projectId: input.projectId,
            extra: input.extra,
            emotion: input.emotion,
            mode: input.mode,
            detection: input.detection,
            concept: input.concept
          }
          // select: defaultPostSelect,
        });

        // skip if detection is auto
        if (input.detection === undefined) {
          ee.emit('change', annotation);
        }
        return annotation;
      }
    }),
  edit: protectedProcedure
    .input(
      z.object({
        annotationId: z.string(), // identifier for the annotation to be edited
        text: z.string().min(1).optional(),
        startTime: z.number().optional(),
        stopTime: z.number().optional(),
        pause: z.boolean().optional(),
        projectId: z.string().optional(),
        extra: z.any().optional(),
        emotion: z.string().optional(),
        concept: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {


      // Check if the annotation with the given ID exists
      const annotation = await prisma.annotation.findUnique({
        where: { id: input.annotationId },
        include: {
          project: true
        }
      });

      if (!annotation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Annotation not found"
        }
        );
      }

      if (annotation.userId === ctx.user?.id || ctx.user?.role === "admin" || annotation.project.userId === ctx.user?.id) {
        // Perform the update
        const updatedAnnotation = await prisma.annotation.update({
          where: { id: input.annotationId },
          data: {
            text: input.text ?? annotation.text,
            startTime: input.startTime ?? annotation.startTime,
            stopTime: input.stopTime ?? annotation.stopTime,
            pause: input.pause ?? annotation.pause,
            projectId: input.projectId ?? annotation.projectId,
            extra: input.extra ?? annotation.extra,
            emotion: input.emotion ?? annotation.emotion,
            concept: input.concept ?? annotation.concept,
          },
        });

        ee.emit('change', updatedAnnotation);
        return updatedAnnotation;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Can't edit this annotation"
      }
      );

    }),

  delete: protectedProcedure
    .input(
      z.object({
        annotationId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {

      // Check if the annotation with the given ID exists
      const annotation = await prisma.annotation.findUnique({
        where: { id: input.annotationId },
        include: {
          project: true
        }
      });

      if (!annotation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Annotation not found"
        }
        );
      }

      if (annotation.userId === ctx.user?.id || ctx.user?.role === "admin" || annotation.project.userId === ctx.user?.id) {
        const annotation = await prisma.annotation.delete({
          where: { id: input.annotationId },
        });
        ee.emit('change', annotation);
        return annotation;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Can't edit this annotation"
      }
      );
    }),
  export: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        format: z.enum(["csv", "xml", "srt", "ods"])
      })
    ).mutation(async ({ input }) => {
      const { format, projectId } = input;


      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          dublin: true,
          title: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found"
        });
      }


      const annotations = await prisma.annotation.findMany({
        where: { projectId: projectId },
        include: {
          comments: true,
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const formated = annotations.map((a) => ({
        date: a.createdAt?.toLocaleString(),
        start: a.startTime,
        end: a.stopTime,
        text: a.text,
        // comments: a.comments.map((c) => c.text),
        user: a.user.username,
        project: project.title,
        contextX: a.extra ? a.extra.relativeX : null,
        contextY: a.extra ? a.extra.relativeY : null,
        emotion: a.emotion,
        performance: a.mode === "performance" ? "on" : "off",
        detection: a.detection,
        concept: a.concept,
      }))

      const sorted = formated.sort((a, b) => a.start - b.start).map((a) => ({
        ...a,
        start: formatTimeFromSeconds(a.start),
        end: formatTimeFromSeconds(a.end),
      }))

      let content = "";
      if (format === 'xml') {
        content = toXML("annotations", sorted, { cdataKeys: ['comments', 'text'] });
      } else if (format === "csv") {
        content = Papa.unparse(sorted);
      } else if (format === "srt") {
        content = toSrt(formated);
      } else if (format === "ods") {
        const worksheet = XLSX.utils.json_to_sheet(sorted);
        const dublinData = Object.entries(project.dublin as Record<string, string>).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        const dublinMetadata = XLSX.utils.json_to_sheet([dublinData]); // Wrap in array for single row
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Annotations");
        XLSX.utils.book_append_sheet(workbook, dublinMetadata, "Metadata Dublin");
        content = XLSX.write(workbook, { type: 'base64', bookType: 'ods' });
      }
      return content
    }),
  stats: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const annotations = await prisma.annotation.findMany({
        where: { projectId: id, emotion: { not: null } },
        select: {
          id: true,
          text: true,
          emotion: true,
          mode: true,
          detection: true,
          createdAt: true,
          concept: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return annotations;
    }),

});
