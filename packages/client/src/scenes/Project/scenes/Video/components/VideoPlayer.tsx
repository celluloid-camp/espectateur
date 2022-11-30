import * as React from 'react';
import YouTube from 'react-youtube';
import { withI18n, WithI18n } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { AppState } from 'types/StateTypes';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlayerReadyEvent, PlayerChangeEvent } from '@celluloid/client/src/types/VideoPlayerTypes';
import Local from './LocalPlayer';

const styles = ({ spacing, palette }: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles>, WithI18n {
    player: string;
    path: string;
    className: string;
    onPlayerReady: (event: PlayerReadyEvent) => void;
    onPlayerStateChange: (event: PlayerChangeEvent) => void;
    onLoadingError: () => void;
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
            switch (this.props.player) {
                case 'Youtube': 
                    {
                        return (
                            <YouTube
                                videoId={this.props.path}
                                opts={{
                                    playerVars: {
                                        modestbranding: 1,
                                        rel: 0,
                                        start: 0,
                                        showinfo: 0,
                                        iv_load_policy: 3,
                                        controls: 0
                                    }
                                }}
                                className={this.props.className}
                                onReady={this.props.onPlayerReady}
                                onStateChange={this.props.onPlayerStateChange}
                            />
                        );
                    }
                    break;
                case 'Local': 
                    {
                        // Local video player
                        return (
                            <Local
                                path={this.props.path}
                                className={this.props.className}
                                onReady={this.props.onPlayerReady}
                                onStateChange={this.props.onPlayerStateChange}
                                onLoadingError={this.props.onLoadingError}
                            />
                        );
                    }
                    break;
                default: 
                    {
                        return (
                            <span>Loading failed.</span>
                        );
                    }
            }
        }
    }
)));