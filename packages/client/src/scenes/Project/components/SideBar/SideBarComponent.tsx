import { ProjectGraphRecord, UserRecord, AnnotationRecord } from '@celluloid/types';
import {
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Theme,
  WithStyles,
  withStyles,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonProgress from 'components/ButtonProgress';
import DialogError from 'components/DialogError';
import LabeledProgressSwitch from 'components/LabeledProgressSwitch';
import UserAvatar from 'components/UserAvatar';
import VisibilityChip from 'components/VisibilityChip';
import * as React from 'react';
import { AsyncAction } from 'types/ActionTypes';
import { isOwner } from 'utils/ProjectUtils';

import ShareDialog from './components/ShareDialog';
import { withI18n, WithI18n } from 'react-i18next';
import { NativeSelect } from '@material-ui/core';
import XMLAnnotationExport from './components/XMLAnnotationExport';
import CSVAnnotationExport from './components/CSVAnnotationExport';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    padding: spacing.unit,
    paddingBottom: 0
  },
  paper: {
    marginTop: 0,
    margin: spacing.unit,
    padding: spacing.unit
  },
  list: {
    padding: 0,
    paddingBottom: spacing.unit * 2
  },
  listItem: {
    padding: 0,
  },
  listHeader: {
    height: spacing.unit * 5,
    textAlign: 'left',
    marginTop: spacing.unit,
    paddingLeft: spacing.unit
  },
  buttonIcon: {
    marginRight: spacing.unit * 2
  },
  chips: {
    paddingTop: spacing.unit,
    textAlign: 'right'
  }
});

export interface Member extends UserRecord {
  subtitle?: string;
}

interface Props extends WithStyles<typeof styles> {
  user?: UserRecord;
  project: ProjectGraphRecord;
  members: Set<Member>;
  setPublicLoading: boolean;
  setCollaborativeLoading: boolean;
  unshareLoading: boolean;
  deleteLoading: boolean;
  setPublicError?: string;
  setCollaborativeError?: string;
  unshareError?: string;
  deleteError?: string;
  performance_mode: boolean;
  sequencing: boolean;
  ownAnnotations: boolean;
  annotations: AnnotationRecord[];
  onClickSetPublic(projectId: string, value: boolean):
    AsyncAction<ProjectGraphRecord, string>;
  onClickSetCollaborative(projectId: string, value: boolean):
    AsyncAction<ProjectGraphRecord, string>;
  onClickShare(): void;
  onClickDelete(projectId: string): AsyncAction<null, string>;
  onClickSwitchPlayerMode(): void;
  onClickSwitchSequencing(): void;
  onClickSwitchOwnAnnotations(): void;
  onChangeAnnotationShowingMode(event: React.ChangeEvent<HTMLSelectElement>): void;
}

export default withStyles(styles)(withI18n()(({
  user,
  project,
  members,
  setCollaborativeLoading,
  setPublicLoading,
  unshareLoading,
  deleteLoading,
  setPublicError,
  setCollaborativeError,
  unshareError,
  deleteError,
  performance_mode,
  sequencing,
  ownAnnotations,
  annotations,
  onClickSetPublic,
  onClickSetCollaborative,
  onClickShare,
  onClickDelete,
  onClickSwitchPlayerMode,
  onClickSwitchSequencing,
  onClickSwitchOwnAnnotations,
  onChangeAnnotationShowingMode,
  classes,
  t
}: Props & WithI18n) => (
    <>
      <div className="Component-wrapper-504">
        <Typography
          variant="body2"
          align="right"
          gutterBottom={true}
          component="div"
        >
          {t('project.annotationsVisibilitySelector')}
          <NativeSelect
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChangeAnnotationShowingMode(event)}
            inputProps={{
              name: 'name',
              id: 'annotation-showingMode-selector',
            }}
            style={{marginLeft: 5}}
          >
            <option value="All">{t('project.annotationsVisibilityAll')}</option>
            <option value="Nothing">{t('project.annotationsVisibilityNothing')}</option>
            <option value="Performance">{t('project.annotationsVisibilityPerformance')}</option>
            <option value="Analyze">{t('project.annotationsVisibilityAnalyze')}</option>
          </NativeSelect>
        </Typography>
      </div>
      {user &&
        <LabeledProgressSwitch
          label={t('project.ownAnnotations')}
          checked={ownAnnotations}
          loading={false}
          onChange={() =>
            onClickSwitchOwnAnnotations()
          }
        />
      }
      {user &&
        <LabeledProgressSwitch
          label={t('project.sequencing')}
          checked={sequencing}
          loading={false}
          onChange={() => {
            onClickSwitchSequencing();
            if (performance_mode === true) {
              onClickSwitchPlayerMode();
            }
          }
          }
        />
      }
      <LabeledProgressSwitch
        label={t('project.analyze')}
        checked={!performance_mode}
        loading={false}
        onChange={() => {
          if (performance_mode === false && sequencing === true) {
            onClickSwitchSequencing();
          }
          onClickSwitchPlayerMode();
        }
          
        }
      />
      <LabeledProgressSwitch
        label={t('project.performance')}
        checked={performance_mode}
        loading={false}
        onChange={() => {
          onClickSwitchPlayerMode();
          if (sequencing === true) {
            onClickSwitchSequencing();
          }
        }
        }
      />
      {(user && isOwner(project, user))
        ? (
          <>
            <LabeledProgressSwitch
              label={t('project.public')}
              checked={project.public}
              loading={setPublicLoading}
              error={setPublicError}
              onChange={() =>
                onClickSetPublic(project.id, !project.public)
              }
            />
            <LabeledProgressSwitch
              label={t('project.collaborative')}
              checked={project.collaborative}
              loading={setCollaborativeLoading}
              error={setCollaborativeError}
              onChange={() =>
                onClickSetCollaborative(project.id, !project.collaborative)
              }
            />
          </>
        ) : (
          <div className={classes.chips}>
            <VisibilityChip
              show={project.public}
              label={t('project.public').toLowerCase()}
            />
            <VisibilityChip
              show={project.collaborative}
              label={t('project.collaborative').toLowerCase()}
            />
          </div>
        )
      }
      {(user && isOwner(project, user)) &&
        <>
          <LabeledProgressSwitch
            label={t('project.shared')}
            checked={project.shared}
            loading={unshareLoading}
            error={unshareError}
            onChange={() => onClickShare()}
          />
          <ShareDialog
            project={project}
          />
        </>
      }
      <div className={classes.chips}>
        {  
           console.log('Annotation spéciale:',annotations[0])}
        <XMLAnnotationExport
          annotations={annotations}
          project={project}
          buttonName={t('project.exportButton')}
        />
        <CSVAnnotationExport
          annotations={annotations}
          project={project}
          buttonName={t('project.exportButton')}
        />
      </div>
      {/* {(user && !isOwner(project, user) && !isMember(project, user) && project.shared) &&
        <div className={classes.button}>
          <ButtonProgress
            variant="contained"
            color="primary"
            size="small"
            fullWidth={true}
            loading={unshareLoading}
            onClick={onClickShare}
          >
            <ShareIcon fontSize="inherit" className={classes.buttonIcon} />
            {`rejoindre`}
          </ButtonProgress>
        </div>
      } */}
      <List
        dense={true}
        className={classes.list}
        subheader={
          <ListSubheader
            className={classes.listHeader}
          >
            {t('project.members', { count: members.size })}
          </ListSubheader>
        }
      >
        {Array.from(members).map((member: Member) => (
          <ListItem key={member.id} className={classes.listItem}>
            <ListItemAvatar>
              <UserAvatar user={member} />
            </ListItemAvatar>
            <ListItemText
              primary={member.username}
              secondary={member.subtitle}
            />
          </ListItem>
        ))}
      </List>
      {(user && isOwner(project, user)) &&
        <div className={classes.button}>
          <ButtonProgress
            variant="contained"
            color="secondary"
            size="small"
            fullWidth={true}
            loading={deleteLoading}
            onClick={() => onClickDelete(project.id)}
          >
            <DeleteIcon fontSize="inherit" className={classes.buttonIcon} />
            {t('deleteAction')}
          </ButtonProgress>
          {deleteError && <DialogError error={deleteError} />}
        </div>
      }
    </>
  )
));