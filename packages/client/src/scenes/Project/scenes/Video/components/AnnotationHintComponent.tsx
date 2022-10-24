import {
     WithStyles, createStyles, Theme, Paper, withStyles, Popover, Typography,
  } from '@material-ui/core';
import * as React from 'react';
import { AnnotationRecord } from '@celluloid/types';
import * as classNames from 'classnames';
import { getUserColor } from 'utils/UserUtils';
  
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
      popover: {
        zIndex: 7,
        height: 100,
        margin: 0,
        padding: 0,
        transition: 'all 0.2s ease',
        pointerEvents: 'none'
      },
  });

interface State {
    open: boolean;
    x: number;
    y: number;
}

interface Props extends WithStyles<typeof styles> {
    duration: number;
    index: number;
    annotation: AnnotationRecord;
    visible: boolean;
    onClick: Function;
  }

export default (withStyles(styles)(
      class extends React.Component<Props, State> {
        state = {
          x: 0,
          y: 0,
          open: false
        } as State;
        
    render() {

        const { 
        duration,
        index,
        annotation,
        classes,
        visible,
        onClick
        } = this.props;

        const getHintStartPosition = (annotationParameter: AnnotationRecord) =>
        `${(annotationParameter.startTime * 100 / duration)}%`;
        const getHintWidth = (annotationParameter: AnnotationRecord) =>
        `${((annotationParameter.stopTime - annotationParameter.startTime) * 100
            / duration
        )}%`;

        const handleOpenPopOver = (e: React.MouseEvent<HTMLDivElement>) => {
            this.setState({x: e.pageX});
            this.setState({y: e.pageY});
            this.setState({open: true});
        };
        const handleClosePopOver = () => {
            this.setState({open: false});
        };
         
        return (
            <div 
                key={index}   
            >
            <Paper
                onClick={() => onClick(annotation)}
                key={annotation.id}
                onMouseEnter={handleOpenPopOver}
                onMouseLeave={handleClosePopOver}
                className={classNames(
                    classes.hint,
                    visible ? classes.visible : classes.hidden
                )}
                style={{
                    color: 'white',
                    top: visible ? 48 + (index * 24) : 0,
                    left: getHintStartPosition(annotation),
                    width: getHintWidth(annotation),
                    backgroundColor: annotation.sequencing ? 'lightblue' : getUserColor(annotation.user),
                    border: annotation.sequencing ? '`4px solid white' 
                    : `2px solid ${getUserColor(annotation.user)}`
                }}
                
            />
            
            {annotation ? 
            <Popover
                PaperProps={{
                    style: {
                        padding: '5px',
                        borderRadius: '50px'
                    }
                }} 
                className={classNames(
                    classes.popover,
                    visible ? classes.visible : classes.hidden
                )}
                id="mouse-over-popover"
                open={this.state.open}
                anchorOrigin={{
                    vertical: this.state.y - 40,
                    horizontal: this.state.x,
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handleClosePopOver} 
                disableRestoreFocus={true}
            >
                <Typography>{annotation.ontology ? annotation.ontology.join('->') : annotation.text}</Typography>
            </Popover>
            :
            <></>
            }
            </div>
        );
  }}));
