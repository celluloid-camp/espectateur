import { AnnotationRecord } from '@celluloid/types';
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from '@material-ui/core';
import * as React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import AnnotationHintComponent from './AnnotationHintComponent';

const styles = (theme: Theme) => createStyles({
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0,
  },
  hint: {
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 6,
    height: 10,
    minWidth: 10,
    margin: 0,
    padding: 0,
    borderRadius: 2,
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
      filter: 'brightness(85%)'
    }
  },
  container: {
    position: 'relative',
    margin: 24,
    height: `calc(100% - ${theme.spacing.unit * 6}px)`,
    width: `calc(100% - ${theme.spacing.unit * 6}px)`,
  },
  title: {
    color: theme.palette.text.disabled,
    top: 0,
    left: 0,
  }
});

interface Props extends WithStyles<typeof styles> {
  duration: number;
  position: number;
  annotations: AnnotationRecord[];
  visible: boolean;
  onClick: Function;
}

export default
  withStyles(styles)(withI18n()((props: Props & WithI18n) => {
    const {
      duration,
      annotations,
      visible,
      onClick,
      classes,
      t
    } = props;

    return (
      <div
        className={classes.container}
      >
        <Typography className={classes.title} align="left" variant="h5">
          {annotations.length > 0
            ? t('annotation.hintLabel', { count: annotations.length })
            : t('annotation.hintLabelNone')
          }
        </Typography>
        {annotations.map((annotation, index) => {
          return (
            <AnnotationHintComponent
              key={index}
              annotation={annotation}
              index={index}
              onClick={onClick}
              visible={visible}
              classes={classes}
              duration={duration}
            />
          );
        })
        }
      </div>
    );
  }));
