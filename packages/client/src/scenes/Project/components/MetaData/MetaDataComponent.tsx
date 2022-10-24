import { ProjectGraphRecord, VideoUpdateData } from '@celluloid/types';
import {
  Grid,
  WithStyles,
  withStyles,
  Button,
  Typography,
  FormControl,
  InputBase,
} from '@material-ui/core';
import * as React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { styles } from '../../ProjectStyles';
import MetaDataField from './MetaDataField';
import { WithI18n, withI18n } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { updateVideoThunk } from '../../../../actions/ProjectActions';
import { AsyncAction } from '../../../../types/ActionTypes';
import { AppState } from 'types/StateTypes';
import ValidationButton from './ValidationButton';
 
interface Props extends WithStyles<typeof styles>, WithI18n {
  updateDataError?: string;
  project?: ProjectGraphRecord;
  onClickValidate(projectId: string, data: VideoUpdateData): AsyncAction<VideoUpdateData, string>;
}

interface State {
  dublincore: string[];
  title: string[];
  creator: string[];
  subject: string[];
  description: string[];
  publisher: string[];
  contributor: string[];
  date: string[];
  type: string[];
  format: string[];
  identifier: string[];
  source: string[];
  language: string[];
  relation: string[];
  coverage: string[];
  rights: string[];
}

const mapStateToProps = (state: AppState) => {
  return {
    updateDataError: state.project.details.updateDataFeedback
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onClickValidate: (projectId: string, data: VideoUpdateData) => 
    updateVideoThunk(projectId, data)(dispatch)
  };
};
export let metaDataDC={
  'title':'null', 'creator':'null', 'subject':'null', 'description':'null', 'publisher':'null', 'contributor':'null', 'date':'null', 'type':'null',
          'format':'null', 'identifier':'null', 'source':'null', 'language':'null', 'relation':'null', 'coverage':'null', 'rights':'null'

}

export default withI18n()(withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<Props, State> {
      state = {
          title: this.props.project ? this.props.project.video.dublin_title : [''],
          creator: this.props.project ? this.props.project.video.dublin_creator : [''],
          subject: this.props.project ? this.props.project.video.dublin_subject : [''],
          description: this.props.project ? this.props.project.video.dublin_description :  [''],
          publisher: this.props.project ? this.props.project.video.dublin_publisher :  [''],
          contributor: this.props.project ? this.props.project.video.dublin_contributor :  [''],
          date: this.props.project ? this.props.project.video.dublin_date : [''],
          type: this.props.project ? this.props.project.video.dublin_type : [''],
          format: this.props.project ? this.props.project.video.dublin_format : [''],
          identifier: this.props.project ? this.props.project.video.dublin_identifier : [''],
          source: this.props.project ? this.props.project.video.dublin_source : [''],
          language: this.props.project ? this.props.project.video.dublin_language : [''],
          relation: this.props.project ? this.props.project.video.dublin_relation : [''],
          coverage: this.props.project ? this.props.project.video.dublin_coverage : [''],
          rights: this.props.project ? this.props.project.video.dublin_rights : [''],
          dublincore: ['title', 'creator', 'subject', 'description', 'publisher', 'contributor', 'date', 'type',
          'format', 'identifier', 'source', 'language', 'relation', 'coverage', 'rights']
      } as State;
  
      render() {
         
          const {classes, project, t} = this.props;
          const projectid: string = project ? project.id : '';
          const projectName: string = project ? project.shareName : '';
          if(this.state.title){ metaDataDC.title=this.state.title.toString()} 
          if(this.state.creator){ metaDataDC.creator=this.state.creator.toString()}
          if(this.state.subject){metaDataDC.subject=this.state.subject.toString()}
          if(this.state.description!=null){metaDataDC.description= this.state.description.toString()}   
          if(this.state.publisher!=null){  metaDataDC.publisher=this.state.publisher.toString()}
          if(this.state.date!=null){metaDataDC.date=this.state.date.toString()}
          if(this.state.identifier!=null){ metaDataDC.identifier=this.state.identifier.toString()}
          if(this.state.identifier!=null){ metaDataDC.identifier=this.state.identifier.toString()}
          if(this.state.rights!=null){  metaDataDC.rights=this.state.rights.toString()}
          if(this.state.type!=null){metaDataDC.type=this.state.type.toString()}
          if(this.state.coverage!=null){metaDataDC.coverage=this.state.coverage.toString()}
          if(this.state.format!=null){metaDataDC.format=this.state.format.toString()}
          if(this.state.relation!=null){metaDataDC.relation=this.state.relation.toString()}
          if(this.state.source!=null){  metaDataDC.source=this.state.source.toString()}
          if(this.state.contributor!=null){metaDataDC.contributor=this.state.contributor.toString()}
          if(this.state.language!=null){metaDataDC.language=this.state.language.toString()}
   
        
          
       

          const handleAddField = (key: string, value: string) => {
            console.log('add func')
            let copy: string[];
            if (this.state[key] != null) {
              copy = this.state[key].slice();
              copy.push(value);
            } else {
              copy = ['', ''];
            }
            this.setState({[key] : copy} as Pick<State, keyof State>);
          };

          const handleCloseField = (key: string, nb: number) => {
            let copy: string[];
            console.log('close func')
            if (this.state[key] != null) {
              copy = this.state[key].slice();
              copy.splice(nb, 1);
            } else {
              copy = [];
            }
            this.setState({[key] : copy} as Pick<State, keyof State>);
          };

          const initializeState = (key: keyof State, xmlDoc: Document) => { 
            console.log('init func')
            this.setState({[key] : ['']} as Pick<State, keyof State>);
            let newItem: string[] = [''];
            for (let i = 0 ; i < xmlDoc.getElementsByTagNameNS
              ('http://purl.org/dc/terms/', key).length ; i++ ) {
              newItem.push(xmlDoc.getElementsByTagNameNS
                ('http://purl.org/dc/terms/', key)[i].innerHTML);
            }
            for (let i = 0 ; i < xmlDoc.getElementsByTagNameNS
              ('http://purl.org/dc/elements/1.1/', key).length ; i++ ) {
              newItem.push(xmlDoc.getElementsByTagNameNS
                ('http://purl.org/dc/elements/1.1/', key)[i].innerHTML);
            }
            newItem.shift();
            this.setState({[key] : newItem} as Pick<State, keyof State>);
          };

          const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            console.log('change func')
            var splits = event.target.name.split(/(\d)/);
            let wsRegex = /^\s*\w+,\s\w+!\s*/;
            var key = splits[0].replace(wsRegex, splits[0]);
            var nb = splits[1];
            var copy: string[];
            if (this.state[key] != null) {
              copy = this.state[key];
              copy[nb] = event.target.value;
            } else {
              copy = [event.target.value];
            }
            this.setState({[key] : copy} as Pick<State, keyof State>);
        };

          return (
            <div className={classes.root}>
     
            <div
              className={classes.content}
            >
              {project &&
                <div>
                  <Grid
                    container={true}
                    direction="row"
                    alignItems="flex-start"
                    spacing={24}
                  >
                    <Grid item={true} xs={12} md={8} lg={9}>
                    <Typography
                      className={classes.datamenu}
                      align="left"
                      gutterBottom={true}
                      variant="h4"
                      color="primary"
                    >
                      MetaData
                    </Typography>
                    <FormControl>
                      <InputBase
                        onInput={ (event: React.ChangeEvent<HTMLInputElement>) => {
                          const target = event.target as HTMLInputElement;
                          const file: File = (target.files as FileList)[0];
                          var fileReader = new FileReader();
                          var stringData: string|ArrayBuffer|null = 'r';
                          fileReader.onload = (progressEvent: Event) => {
                            stringData = fileReader.result;
                            const parser = new DOMParser();
                            if ( stringData !== null) {
                              var xmlDoc = parser.parseFromString(stringData as string, 'text/xml');
                              this.state.dublincore.map(key => {
                                initializeState(key as keyof State, xmlDoc);
                              });
                            }

                          };
                          fileReader.readAsText(file, 'UTF-8'); 

                        }}
                        type="file"
                        id="contained-button-file"
                        className={classes.input}
                        name="videoFile"
                        /* onChange={handleChangeVideoFile} */
                      />
                      <label htmlFor="contained-button-file">
                      <Button
                        component="span"
                        variant="extendedFab"
                        color="primary"
                        className={classes.import}
                      >
                        {t('project.importButton')}
                      </Button> 
                      </label>
                    </FormControl>
                    </Grid>
                    <Grid
                      className={classes.sideBar}
                      item={true}
                      xs={8}
                      md={4}
                      lg={3}
                    >
                      <ValidationButton
                        fieldName={t('project.validationButton')}
                        title={this.state.title}
                        creator={this.state.creator}
                        subject={this.state.subject}
                        description={this.state.description}
                        contributor={this.state.contributor}
                        publisher={this.state.publisher}
                        date={this.state.date}
                        type={this.state.type}
                        format={this.state.format}
                        identifier={this.state.identifier}
                        source={this.state.source}
                        language={this.state.language}
                        relation={this.state.relation}
                        coverage={this.state.coverage}
                        rights={this.state.rights}
                        updateDataMessage={this.props.updateDataError}
                        projectid={projectid}
                        onClickValidate={this.props.onClickValidate}
                      />
                      <Button
                        onClick={() => {
                          console.log('expooooooooooooooort',metaDataDC)
                          var data = '<?xml version="1.0" encoding="UTF-8"?>' + '\n'
                          + '<rdf:RDF' + '\n'
                          + '\t' + 'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' + '\n'
                          + '\t' + 'xmlns:dcterms="http://purl.org/dc/terms/"' + '\n'
                          +  '>' + '\n' ;
                          this.state.dublincore.map(dc => {
                           // console.log('dublin core: ', dc)
                            if (this.state[dc] != null ) { 
                              let stringAppend: string = '';
                              this.state[dc].filter((word: string) => word !== '').map((item: string) => {
                               // console.log('item ',dc, item )
                                 stringAppend = stringAppend + '<dcterms:' + dc + '>' 
                                 + item + '</dcterms:' + dc + '>' + '\n';
                              }
                            );
                              if (stringAppend === '') {
                               stringAppend = '<dcterms:' + dc + '>' + 'null' + '</dcterms:' + dc + '>' + '\n';
                            //   console.log('item ',dc )
                            }
                              data = data + stringAppend;
                            } else {
                              data = data + '<dcterms:' + dc + '>' + 'null' + '</dcterms:' + dc + '>' + '\n';
                           //   console.log('item ',dc )
                            }
                        });
                          data = data + '</rdf:RDF>';
                          var blob = new Blob([data], {type: 'text/xml'});
                          if (window.navigator.msSaveOrOpenBlob) {
                              window.navigator.msSaveBlob(blob, 'metadata' + projectName);
                          } else {
                              var elem = window.document.createElement('a');
                              elem.href = window.URL.createObjectURL(blob);
                              elem.download = 'metadata' + projectName + '.xml';        
                              document.body.appendChild(elem);
                              elem.click();        
                              document.body.removeChild(elem);
                            }
                          }
                        }
                        variant="outlined"
                        color="primary"
                        className={classes.datamenu}
                      >
                        <CloudUploadIcon className={classes.dataicon} color="primary" />
                        {t('project.exportButton')}
                      </Button>                 
                    </Grid>
                    
                      {
                        this.state.dublincore.map(dc => {
                        return (
                          <MetaDataField                       
                            onAdd={handleAddField}
                            onClose={handleCloseField}
                            onChange={handleChange}
                            label={t('project.dublin' + dc)}
                            key={dc}
                            field={dc}
                            value={this.state[dc]}
                            project={this.props.project}
                          />
                          );
                        })
                      }
                  </Grid>
                </div>
              }
            </div>
          </div>
          );
      }
    
  })));
 