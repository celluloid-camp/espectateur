import * as React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { AppState } from 'types/StateTypes';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlayerReadyEvent, PlayerChangeEvent, Player } 
from '@celluloid/client/src/types/VideoPlayerTypes';

const styles = ({ spacing, palette }: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles>, WithI18n {
    path: string;
    className: string;
    onReady: (event: PlayerReadyEvent) => void;
    onStateChange: (event: PlayerChangeEvent) => void;
    onLoadingError: () => void;
}
  
interface State {
    playing: boolean;
}

function initState(): State {
    return {
        playing: false
    };
}

const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {};
};

export default withI18n()(withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(
      class extends React.Component<Props, State> implements Player {
        state = initState();

        constructor(props: Props) {
            super(props);
            this.props.onStateChange({target: this, data: -1});
        }

        getCurrentTime() {
            let video: HTMLVideoElement|null = document.querySelector('.' + this.props.className);
            if (video) {
                return video.currentTime;
            } else {
                return 0;
            }
        }

        getDuration() {
            let video: HTMLVideoElement|null = document.querySelector('.' + this.props.className);
            if (video) {
                return video.duration;
            } else {
                return 0;
            }
        }

        playVideo() {
            let video: HTMLVideoElement|null = document.querySelector('.' + this.props.className);
            if (video) {
                video.play();
                this.setState({playing: true});
            }
        }

        pauseVideo() {
            let video: HTMLVideoElement|null = document.querySelector('.' + this.props.className);
            if (video) {
                video.pause();
                this.setState({playing: false});
            }
        }

        seekTo(position: number, allowSeekAhead: boolean) {
            let video: HTMLVideoElement|null = document.querySelector('.' + this.props.className);
            if (video && allowSeekAhead) {
                video.currentTime = position;
                if (this.state.playing) {
                    video.pause();
                    video.play();
                }
            }
        }

        render() {
            return (
                <video 
                    className={this.props.className}
                    src={'/api/video/' + this.props.path}
                    onPlay={() => this.props.onStateChange({target: this, data: 1})}
                    onEnded={() => this.props.onStateChange({target: this, data: 0})}
                    onPause={() => this.props.onStateChange({target: this, data: 2})}
                    onLoadedData={() => this.props.onReady({target: this})}
                    onError={() => this.props.onLoadingError()}
                />
            );
        }
    })
));