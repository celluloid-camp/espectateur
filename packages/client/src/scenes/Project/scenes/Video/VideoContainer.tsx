import { AnnotationRecord, ProjectGraphRecord, UserRecord } from '@celluloid/types';
import { listAnnotationsThunk, triggerBlurAnnotation } from 'actions/AnnotationsActions';
import { playerNotifySeek, playerRequestSeek } from 'actions/PlayerActions';
import * as R from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action, AsyncAction, EmptyAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';
import { Player, PlayerEventData } from 'types/VideoPlayerTypes';
import * as AnnotationUtils from 'utils/AnnotationUtils';

import VideoComponent from './VideoComponent';

const FADE_TIMEOUT = 3000;

interface Props {
  user?: UserRecord;
  annotations: AnnotationRecord[];
  project: ProjectGraphRecord;
  seeking: boolean;
  focusedAnnotation?: AnnotationRecord;
  performance_mode: boolean;
  ownAnnotations: boolean;
  annotationShowingMode: string;
  sequencing_mode: boolean;
  load(projectId: string):
    AsyncAction<AnnotationRecord[], string>;
  notifySeek(): EmptyAction;
  requestSeek(seekTarget: number): Action<number>;
  blurAnnotation(): EmptyAction;
  onLoadingError(): void;
}

interface State {
  player?: Player;
  position: number;
  duration: number;
  playing: boolean;
  fullscreen: boolean;
  showControls: boolean;
  showHints: boolean;
  visibleAnnotations: AnnotationRecord[];
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  annotations: state.project.video.annotations,
  seeking: state.project.player.seeking,
  focusedAnnotation: state.project.video.focusedAnnotation,
  performance_mode: state.project.player.performance_mode,
  ownAnnotations: state.project.details.ownAnnotations,
  annotationShowingMode: state.project.details.annotationShowingMode,
  sequencing_mode: state.project.player.sequencing
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: (projectId: string) =>
    listAnnotationsThunk(projectId)(dispatch),
  notifySeek: () =>
    dispatch(playerNotifySeek()),
  requestSeek: (seekTarget: number) =>
    dispatch(playerRequestSeek(seekTarget)),
  blurAnnotation: () =>
    dispatch(triggerBlurAnnotation())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<Props, State> {
    fadeoutTimer = -1;
    refreshTimer = -1;
    state = {
      playing: false,
      position: 0,
      duration: 0,
      fullscreen: false,
      showControls: true,
      showHints: false,
      visibleAnnotations: [],
      annotating: false
    } as State;

    componentDidMount() {
      this.resetFadeOutTimer();
      this.props.load(this.props.project.id);
    }

    componentDidUpdate(prevProps: Props) {
      if (!R.equals(this.props.user, prevProps.user)) {
        this.props.load(this.props.project.id);
      }
    }

    componentWillUnmount() {
      clearInterval(this.refreshTimer);
      clearInterval(this.fadeoutTimer);
    }

    refreshPlayer() {
      const { player } = this.state;

      if (player) {
        const annotations = this.props.annotations;
        const focusedAnnotation = this.props.focusedAnnotation;
        const position = player.getCurrentTime();
        const visibleAnnotations = annotations
          .filter(annotation =>
            (AnnotationUtils.visible(annotation, position) && (
              this.props.annotationShowingMode === 'All' ||
              (this.props.annotationShowingMode === 'Performance' && annotation.performance_mode) ||
              (this.props.annotationShowingMode === 'Analyze' && !annotation.performance_mode)
            ) && (
              (this.props.ownAnnotations && this.props.user && annotation.userId === this.props.user.id) ||
              !this.props.ownAnnotations
            )
            && (
              (this.props.sequencing_mode && annotation.sequencing ) ||
              !this.props.sequencing_mode
            ))
          );
        visibleAnnotations.forEach(annotation => {
          if (annotation.pause
            && annotation.startTime >= position - 0.10
            && annotation.startTime < position + 0.10) {
            player.pauseVideo();
            player.seekTo(position + 0.10, !this.props.performance_mode);
          }
        });

        const isFocusedAnnotationPredicate = (elem: AnnotationRecord) =>
          !!focusedAnnotation && elem.id === focusedAnnotation.id;
        const shouldBlur =
          !R.find(isFocusedAnnotationPredicate, visibleAnnotations) && focusedAnnotation;

        if (shouldBlur) {
          this.props.blurAnnotation();
        }
        if (!this.props.seeking) {
          this.setState({
            visibleAnnotations,
            position: position,
          });
        }
      }
    }

    resetFadeOutTimer() {
      this.setState({ showControls: true });
      clearInterval(this.fadeoutTimer);
      this.fadeoutTimer = window.setInterval(
        this.fadeOutControls.bind(this), FADE_TIMEOUT
      );
    }

    fadeOutControls() {
      this.setState({ showControls: false });
    }

    seek(value: number, pause: boolean, seekAhead: boolean) {
      this.setState({ position: value });
      const player = this.state.player;
      if (!this.props.performance_mode) {
        if (player) {
          if (pause) {
            player.pauseVideo();
          }
          player.seekTo(value, seekAhead);
          this.props.requestSeek(value);
        }
      }
    }

    render() {
      const {
        user,
        project,
        annotations
      } = this.props;

      const {
        player,
        playing,
        position,
        duration,
        showControls,
        showHints,
        fullscreen,
        visibleAnnotations,
      } = this.state;

      const onUserAction = this.resetFadeOutTimer.bind(this);

      const onPlayerReady = (event: { target: Player }) => {
        this.refreshTimer = window.setInterval(
          this.refreshPlayer.bind(this), 200);
        this.setState({
          player: event.target,
          duration: event.target.getDuration()
        });
      };

      const onPlayerStateChange = (event: { target: Player, data: number }) => {
        const state = event.data as PlayerEventData;
        switch (state) {
          case PlayerEventData.PLAYING:
            this.setState({ playing: true });
            this.props.notifySeek();
            break;
          case PlayerEventData.BUFFERING:
          case PlayerEventData.CUED:
          case PlayerEventData.ENDED:
          case PlayerEventData.UNSTARTED:

          default:
            this.setState({ playing: false });
        }
      };

      const onFullscreenChange = (newFullscreen: boolean) =>
        this.setState({ fullscreen: newFullscreen });

      const onTogglePlayPause = () => {
        onUserAction();
        if (player) {
          if (playing && !this.props.performance_mode) {
            player.pauseVideo();
          } else {
            player.playVideo();
          }
        }
      };

      const onToggleFullscreen = () =>
        this.setState(prevState => ({
          ...prevState,
          fullscreen: !prevState.fullscreen
        }));

      const onToggleHints = () => {
        this.setState(prevState => ({
          ...prevState,
          showHints: !prevState.showHints
        }));
      };

      const onClickHint = (annotation: AnnotationRecord) => {
        this.setState({
          showHints: false
        });
        this.seek(annotation.startTime, false, true);
      };

      const onSeek = this.seek.bind(this);

      return (
        <VideoComponent
          user={user}
          project={project}
          annotations={annotations}
          visibleAnnotations={visibleAnnotations}
          position={position}
          duration={duration}
          playing={playing}
          fullscreen={fullscreen}
          showControls={showControls}
          showHints={showHints}
          onUserAction={onUserAction}
          onPlayerReady={onPlayerReady}
          onPlayerStateChange={onPlayerStateChange}
          onFullscreenChange={onFullscreenChange}
          onTogglePlayPause={onTogglePlayPause}
          onToggleFullscreen={onToggleFullscreen}
          onToggleHints={onToggleHints}
          onClickHint={onClickHint}
          onLoadingError={this.props.onLoadingError}
          onSeek={onSeek}
        />
      );
    }
  });
