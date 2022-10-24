import 'rc-slider/assets/index.css';

import DialogHeader from 'components/DialogHeader';
import { EmptyAction } from 'types/ActionTypes';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from 'types/StateTypes';
import { withI18n, WithI18n } from 'react-i18next';
import { closeJoinProject, joinProject } from 'actions/HomeActions';
import DialogError from 'components/DialogError';

const styles = ({ spacing }: Theme) => createStyles({
  tagList: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  },
  levels: {
    paddingTop: spacing.unit * 4,
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  levelSlider: {
    flexGrow: 1,
    paddingTop: 6
  },
  levelLabel: {
    fontWeight: 'bold',
    width: spacing.unit * 12
  },
  assignmentInput: {
    marginRight: spacing.unit * 2
  },
  content: {
    padding: spacing.unit * 2,
    margin: spacing.unit
  },
  sectionTitle: {
    paddingTop: spacing.unit * 4
  },
  image: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  videoTitleWrapper: {
    position: 'absolute',
    padding: `${spacing.unit}px ${spacing.unit * 3}px`,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    bottom: 0,
    right: 0,
    left: 0,
  },
  videoTitle: {
    color: 'white',
    fontWeight: 500
  },
  switchLabel: {
    paddingTop: spacing.unit * 1.5
  }
});

interface Props extends WithStyles<typeof styles> {
  error?: string;
  onSubmit(shareCode?: string):
    Promise<void>;
  onCancel(): EmptyAction;
}

const mapStateToProps = (state: AppState) => ({
  error: state.home.errors.joinProject
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCancel: () => dispatch(closeJoinProject()),
  onSubmit: (shareCode?: string) =>
  joinProject(shareCode)(dispatch)
});

interface State {
  projectCode: string;
}

function initState(): State {
  return {
    projectCode: ''
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(
  withI18n()(class extends React.Component<Props & WithI18n, State> {

    state = initState();

    render() {

      const { projectCode } = this.state;

      const {
        classes,
        error,
        onSubmit,
        onCancel,
        t
      } = this.props;
      return (
        <Dialog
          open={true}
          fullWidth={true}
          onClose={() => onCancel()}
          scroll="body"
        >
          <DialogHeader
            title={t('project.joinTitle')}
            onClose={() => onCancel()}
            loading={false}
          />
          <DialogContent className={classes.content}>
            <TextField
              margin="normal"
              label={t('project.shareCode')}
              fullWidth={true}
              helperText={t('project.joinProjectDescription')}
              multiline={true}
              onChange={event => {
                this.setState({
                  projectCode: event.target.value
                });
              }}
              value={projectCode}
            />
            {error && <DialogError error={error} />}
          </DialogContent>
          <DialogActions style={{ textAlign: 'center' }}>
            <Button
              onClick={() => onCancel()}
              color="secondary"
              variant="contained"
            >
              {t('cancelAction')}
            </Button>
            <Button
              onClick={() => onSubmit(this.state.projectCode)}
              color="primary"
              variant="contained"
            >
              {t('createAction')}
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
  })
));