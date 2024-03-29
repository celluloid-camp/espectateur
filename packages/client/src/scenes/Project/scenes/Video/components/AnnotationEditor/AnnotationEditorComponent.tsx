import 'rc-slider/assets/index.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import getFirstConcepts,{getSubConcepts, getRelation} from '../../../../../../api/Concept';
import addAnnotation from '../../../../../../api/Annotation';
import { userName, userId } from './AnnotationEditorContainer';
import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  IconButton,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Clear';
import { Range } from 'rc-slider';
import * as React from 'react';
import { formatDuration } from 'utils/DurationUtils';
import TransparentInput from '../TransparentInput';
import { sliderRailStyle, sliderTrackStyle } from 'utils/SliderUtils';
import { withI18n, WithI18n } from 'react-i18next';
//import { on } from 'process';
const caretStart = require('images/caret-start.png');
const caretStop = require('images/caret-stop.png');

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    content: {
      flex: '1 1 auto',
      minWidth: 0,
      padding: `0 ${theme.spacing.unit * 2}px`,
      '&:first-child': {
        paddingLeft: 0,
      },
      margin: 10,
    },
    centerVerticalement: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    timeline: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonRoot: {
      fontSize: 10,
      lineHeight: '20px',
      minWidth: 20,
      minHeight: 20,
      maxWidth: 20,
      maxHeight: 20,
      margin: 4,
      marginBottom: 7,
      padding: 0,
      borderRadius: '50%',
    },
  


  });

  const CSS = `
  #custom-select {
    position: center;
    font-family:"sans-serif"
    font-size: 50px;
    color:#000000;
    width: 220px;
    display: inline;
    padding-left 10px; 
    padding-right:20px;
  }
  #option{
    width: 50px;
    font-size: 25px
 
  }


  `;


interface Props extends WithStyles<typeof styles> {
  startTime: number;
  stopTime: number;
  pause: boolean;
  text: string;
  duration: number;
  projectId: string;
  sequencing: boolean;
  error?: string;
  performance_mode: boolean;
  ontology?: string[];
  onTextChange(text: string): void;
  onCheckPauseChange(value: boolean): void;
  onTimingChange(value: number, isStart: boolean, seekAhead: boolean): void;
  onClickSave(): void;
  onClickCancel(): void;
  onOntologyChange(ontology: string[]): void;
}

interface TimingButtonProps extends WithStyles<typeof styles> {
  forward: boolean;
  onSeek(): void;
}

interface TimingControlProps extends WithStyles<typeof styles> {
  position: number;
  onBack(): void;
  onForward(): void;
}

const TimingButton = (props: TimingButtonProps) => (
  <Button
    classes={{ root: props.classes.buttonRoot }}
    size="small"
    onClick={() => {
      props.onSeek();
    }}
  >
    {!props.forward ? `◀` : `▶`}
  </Button>
);
// const options= getFirstConcepts('concept');

const TimingControl = (props: TimingControlProps) => (
  <>
    <TimingButton
      forward={false}
      onSeek={props.onBack}
      classes={props.classes}
    />
    <Typography variant="caption">{formatDuration(props.position)}</Typography>
    <TimingButton
      forward={true}
      onSeek={props.onForward}
      classes={props.classes}
    />
  </>
);

const emojis = [
  {
    label: 'Emotions & Judgements',
    value: '',
  },
  {
    label: '😤',
    value: 'Annoyance',
  },
  {
    label: '🥱',
    value: 'Boredom',
  },
  {
    label: '😱',
    value: 'Fear',
  },
  {
    label: '🥲',
    value: 'Sadness',
  },
  {
    label: '😮',
    value: 'Surprise',
  },
  {
    label: '🤔',
    value: 'Questioning',
  },
  {
    label: '🥰',
    value: 'Empathy',
  },
  {
    label: '😀',
    value: 'Laugh',
  },
  {
    label: '🤣',
    value: 'Hilarity',
  },
  {
    label: '💔',
    value: 'Hate',
  },
  {
    label: '👎',
    value: 'Dislike',
  },
  {
    label: '👍',
    value: 'Like',
  },
 
  {
    label: '❤️',
    value: 'Love',
  },

 
];
export let globalEmoji=''
let globalConcept='concept'
let firstConcept=globalConcept
let secondConcept='concept'
let thirdConcept='concept'
let fourthConcept='concept'
let fiveConcept='concept'
let sixConcept='concept'
const options = getFirstConcepts(globalConcept);

class App extends React.Component <{perf: boolean}, {emoji: string, concept: string, concept1: string, concept2: string,concept3: string,concept4: string,concept5: string,concept6: string, option1:any, option2:any ,option3:any ,option4:any, option5: any, option6: any}> {
  constructor(props: any) {
    super(props);
   
    this.state = {
     
      concept: globalConcept,
      concept1:'concept 2',
      concept2:'concept 3',
      concept3:'concept 4',
      concept4:fourthConcept,
      concept5:fiveConcept,
      concept6:sixConcept,
      emoji:'Emoji',
      option1:[],
      option2:[],
      option3:[],
      option4:[],
      option5:[],
      option6:[],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
  }
handleChange(e) {
    this.setState({ concept: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option1:conc1})
    globalConcept=e.target.value;
    firstConcept=e.target.value;
    secondConcept=e.target.value;
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    console.log(' button 1',globalConcept)
  }
handleChange1(e) {
    this.setState({ concept1: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option2:conc1})
    secondConcept=e.target.value;
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 2',globalConcept)
  }
  handleChange2(e) {
    this.setState({ concept2: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option3:conc1})
    thirdConcept=e.target.value;
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 3',globalConcept)
  }
  handleChange3(e) {
    this.setState({ concept3: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option4:conc1})
    fourthConcept=e.target.value;
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 4',globalConcept)
  }
  handleChange4(e) {
    this.setState({ concept4: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option5:conc1})
    fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 5',globalConcept)
  }
  handleChange5(e) {
    this.setState({ concept5: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option6:conc1})
  //  fiveConcept=e.target.value;
    sixConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 6',globalConcept)
  }
  handleChange6(e) {
    this.setState({ concept6: e.target.value });
    const conc1=getSubConcepts(e.target.value )
    this.setState({option6:conc1})
   // fiveConcept=e.target.value;
    globalConcept=e.target.value;
    console.log(' button 6',globalConcept)
  }
  handleEmoji(e) {
    this.setState({ emoji: e.target.value });
    globalEmoji=e.target.value;
  }

  render() { 
    console.log('mode performance ', this.props.perf)
    return (
      <div id="App">
       
        <div id="custom-select">
        <style>{CSS}</style>
      {!this.props.perf ? (
        <>
          <select id="custom-select" value={this.state.concept} onChange={this.handleChange}>
            {options.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          {/* <select value={this.state.concept1} onChange={this.handleChange1}>
            {this.state.option1.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept2} onChange={this.handleChange2}>
            {this.state.option2.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept3} onChange={this.handleChange3}>
            {this.state.option3.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept4} onChange={this.handleChange4}>
            {this.state.option4.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept5} onChange={this.handleChange5}>
            {this.state.option5.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept6} onChange={this.handleChange6}>
            {this.state.option6.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select> */}
        </>
      ) : (
        <></>
      )}
      
          
          <select id="custom-select" value={this.state.emoji} onChange={this.handleEmoji}>
            {emojis.map((emoji) => (
              <option id="option" value={emoji.value}>{emoji.label}</option>
            ))}
          </select> 
          </div>
      </div>
        
    );
  }
}

function PostAnnotation(startTime: number, stopTime: number, text: String,projectId: string,annotationId: any) {
  const relation=getRelation(firstConcept)
  console.log(' les 3 derniers concept',fourthConcept,sixConcept, fiveConcept,globalConcept)
  const annotationData= {
    projectId:projectId,
    userId:userId,
    commentaire:text,
    stopTime:stopTime,
    startTime: startTime,
   
    objet: [firstConcept,secondConcept,thirdConcept,fourthConcept, fiveConcept,sixConcept,globalConcept],
    userName:userName,
    relation:relation,
    annotationId:annotationId
  }
  if(firstConcept!=='Annotation Libre'){
    addAnnotation(annotationData)
  }
  
}
 export default withStyles(styles) (
  withI18n() (
    ({
      startTime,
      stopTime,
      pause,
      text,
      duration,
      sequencing,
      error,
      performance_mode,
      projectId,
      onCheckPauseChange,
      onTimingChange,
      onTextChange,
      onClickSave,
      onClickCancel,
      onOntologyChange,
      classes,
      t,
    } : Props & WithI18n) => {
      const handleStyles = {
        border: 0,
        borderRadius: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backgroundSize: 'cover',
        width: 12,
        height: 12,
      };
    
     
      return (
        
        <div className={classes.root}>
          <div className={classes.content}>
            {!performance_mode && !sequencing ? <></> : <></>}
            <div className={classes.centerVerticalement}>
            <App
              perf={performance_mode}
            />
            </div>
           {/*  {!performance_mode ? ( */}
                <>
                    <TransparentInput
                      text={text}
                      error={error}
                      onChange={onTextChange}
                      placeholder={t('annotation.contentPlaceholder')}
                    />
                </>
          {/*   ) : ( */}
                <></>
           {/*  )} */}
         
            <div className={classes.timeline}>
              <TimingControl
                onBack={() =>
                  onTimingChange(Math.max(0, startTime - 1), true, true)
                }
                onForward={() =>
                  onTimingChange(Math.min(stopTime, startTime + 1), true, true)
                }
                position={startTime}
                classes={classes}
              />
              <div style={{ padding: 8, flexGrow: 1 }}>
                <Range
                  min={0}
                  max={duration}
                  value={[startTime, stopTime]}
                  onChange={(values) => {
                    if (startTime !== values[0]) {
                      onTimingChange(values[0], true, false);
                    } else if (stopTime !== values[1]) {
                      onTimingChange(values[1], false, false);
                    }
                  }}
                  onAfterChange={(values) => {
                    if (startTime !== values[0]) {
                      onTimingChange(values[0], true, true);
                    } else if (stopTime !== values[1]) {
                      onTimingChange(values[1], false, true);
                    }
                  }}
                  trackStyle={sliderTrackStyle}
                  railStyle={sliderRailStyle}
                  handleStyle={[
                    {
                      ...handleStyles,
                      marginTop: -11,
                      marginLeft: -5,
                      backgroundImage: `url(${caretStart})`,
                    },
                    {
                      ...handleStyles,
                      marginTop: 3,
                      marginLeft: -6,
                      backgroundImage: `url(${caretStop})`,
                    },
                  ]}
                  allowCross={false}
                />
              </div>
              <TimingControl
                onBack={() =>
                  onTimingChange(Math.max(startTime, stopTime - 1), false, true)
                }
                onForward={() =>
                  onTimingChange(Math.min(stopTime + 1, duration), false, true)
                }
                position={stopTime}
                classes={classes}
                
              />
            </div>
           
            <div className={classes.buttons}>
              {!performance_mode ? (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={pause}
                        onChange={(event) =>
                          onCheckPauseChange(event.target.checked)
                        }
                      />
                    }
                    label={t('annotation.pauseLabel')}
                  />
                </>
              ) : (
                <></>
              )}
              <IconButton
               color="secondary" 
               onClick={() =>
               { 
                 onClickCancel() 
               }
                       }
              >
                <CancelIcon />
              </IconButton>
              <IconButton 
               color="primary" 
               onClick={async ()  =>
               { 
                const annotationId= await onClickSave() 
                 PostAnnotation(startTime, stopTime, text,projectId,annotationId);
                 globalEmoji='';
               }
                       }
              >
                <CheckIcon />
              </IconButton>
             
            </div>
          </div>
        </div>
      );
    }
  )
);
  