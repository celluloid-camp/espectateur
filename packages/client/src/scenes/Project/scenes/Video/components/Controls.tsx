import 'rc-slider/assets/index.css';

import { AnnotationRecord } from '@celluloid/types';
import {
  Badge,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from '@material-ui/core';
import AnnotationIcon from '@material-ui/icons/Comment';
import FullScreenEnterIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import Slider from 'rc-slider';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'types/StateTypes';
import { formatDuration } from 'utils/DurationUtils';
import { sliderTrackStyle, sliderRailStyle, sliderHandleStyle } from 'utils/SliderUtils';

const styles = ({ spacing }: Theme) => createStyles({
  badge: {
    top: spacing.unit,
    right: spacing.unit
  },
  controls: {
    transition: 'all 0.5s ease',
    width: '100%',
    height: '100%',
    bottom: 0,
    margin: 0,
    padding: 0,
  },
  icon: {
    padding: 0,
    height: 32,
    width: 32
  },
  slider: {
    paddingTop: 6
  },
});

interface Props extends WithStyles<typeof styles> {
  annotations: AnnotationRecord[];
  playing: boolean;
  seeking: boolean;
  seekTarget: number;
  duration: number;
  position: number;
  fullscreen: boolean;
  performance_mode: boolean;
  onSeek(position: number, pause: boolean, seekAhead: boolean): void;
  onTogglePlayPause(): void;
  onToggleFullscreen(): void;
  onToggleHints(): void;
}

interface State {
  seekTarget: number;
}

const mapStateToProps = (state: AppState) => ({
  seeking: state.project.player.seeking,
  seekTarget: state.project.player.seekTarget,
  performance_mode: state.project.player.performance_mode
});

export default connect(mapStateToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      render() {
        const {
          annotations,
          playing,
          duration,
          position,
          fullscreen,
          onTogglePlayPause,
          onToggleFullscreen,
          onToggleHints,
          onSeek,
          seeking,
          seekTarget,
          classes,
          performance_mode,
        } = this.props;

        return (
          <Grid
            container={true}
            direction="row"
            spacing={24}
            justify="space-between"
            alignItems="center"
            className={classes.controls}
          >
            <Grid item={true}>
              {!playing || !performance_mode ?
                <IconButton
                  color="inherit"
                  onClick={() => onTogglePlayPause()}
                  classes={{ root: classes.icon }}
                >
                  {playing ?
                    <PauseIcon /> :
                    <PlayIcon />
                  }
                </IconButton> :
                <></>
              }
            </Grid>
            <Grid item={true}>
              <Typography
                style={{ color: 'white' }}
                variant="caption"
              >
                {formatDuration(seeking ? seekTarget : position)}
              </Typography>
            </Grid>
            <Grid item={true} style={{ flexGrow: 1 }}>
              <Grid
                container={true}
                direction="column"
              >
                <Grid item={true} style={{ flexGrow: 1 }}>
                  <Slider
                    className={classes.slider}
                    min={0}
                    max={duration}
                    value={seeking ? seekTarget : position}
                    trackStyle={sliderTrackStyle}
                    railStyle={sliderRailStyle}
                    handleStyle={[sliderHandleStyle]}
                    onChange={value => {
                      onSeek(value, false, false);
                    }}
                    onAfterChange={value => {
                      onSeek(value, false, true);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item={true}>
              <Typography
                style={{ color: 'white' }}
                variant="caption"
              >
                {formatDuration(duration)}
              </Typography>
            </Grid>
              <Grid item={true}>
              <IconButton
                color="secondary"
                onClick={() => onToggleHints()}
                classes={{ root: classes.icon }}
              >
                <Badge
                  badgeContent={annotations.length}
                  color="primary"
                  className={classes.badge}
                >
                  <AnnotationIcon />
                </Badge>
              </IconButton>
            </Grid>
            <Grid item={true}>
              <IconButton
                color="inherit"
                onClick={() => onToggleFullscreen()}
                classes={{ root: classes.icon }}
              >
                {fullscreen ?
                  <FullscreenExitIcon /> :
                  <FullScreenEnterIcon />
                }
              </IconButton>
            </Grid>
          </Grid>
        );
      }
    }
  ));