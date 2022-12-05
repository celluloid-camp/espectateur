import * as React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { AppState } from 'types/StateTypes';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { AsyncAction } from '../../../types/ActionTypes';
import { Video } from 'types/VideoPlayerTypes';
import { UserRecord } from '@celluloid/types';

const styles = ({ spacing, palette }: Theme) => createStyles({
});

interface Props extends WithStyles<typeof styles>, WithI18n {
    player: string;
    newProjectVideoUrl: string;
    errors: {
        video?: string;
        projects?: string;
    };
    user?: UserRecord;
    newVideoFile: File;
    handleOpen: () => void;
    onClickNewProject(player: string, url: string, user?: UserRecord, file?: File): AsyncAction<Video, string>;
    
}

interface State {}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {};
};

export default withI18n()(withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(
      class extends React.Component<Props, State> {
            render() {
                const { t } = this.props;
                if (this.props.player) {
                    if (this.props.player === 'Peertube') {
                        return (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.props.onClickNewProject(
                                    this.props.player, 
                                    this.props.newProjectVideoUrl, 
                                    this.props.user
                                ).then(() => {
                                    if (this.props.errors.video !== undefined) {
                                        this.props.handleOpen();
                                    }
                                } )}
                                fullWidth={true}
                            >
                                {t('home.newProject')}
                            </Button>
                        );
                    } else if (this.props.player === 'Local') {
                        return (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.props.onClickNewProject(
                                    this.props.player, 
                                    '', 
                                    this.props.user,
                                    this.props.newVideoFile
                                ).then(() => {
                                    if (this.props.errors.video !== undefined) {
                                    this.props.handleOpen();
                                    }
                                } )}
                                fullWidth={true}
                            >
                                {t('home.newProject')}
                            </Button>
                                
                        );
                    }
                }
                return (
                    <span>Please, select a type of video (ex: Peertube).</span>
                );
            }
        }
    )
));