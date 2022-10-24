import * as React from 'react';
import ButtonProgress from 'components/ButtonProgress';
import { ProjectGraphRecord, AnnotationRecord } from '@celluloid/types';
import {getConcept} from '../../.././../../api/Annotation'



interface Props  {
    annotations: AnnotationRecord[];
    project: ProjectGraphRecord;
    buttonName: string;
  }

export default (
      (
        class extends React.Component<Props> {

          render() {
           
           const {annotations, project } = this.props;
           annotations.map(async(annotation) => {  
            let res= await getConcept(annotation.id)
            annotation.ontology= res
          })
           return (
            <ButtonProgress
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  var data = '<?xml version="1.0" encoding="UTF-8"?>' + '\n'
                  + '<Project name="' + project.shareName + '"' + ' Objectif="' + project.objective + '" ' + '>' + '\n';
             
         
                 {annotations.map((annotation) => {
                  let annotationData: string = '';
                  if (annotation.ontology) {
                  annotation.ontology.map((item, index) => {
                     if (index === (annotation.ontology ? annotation.ontology.length - 1 : 0)) {
                    //  console.log('annotation data 1', annotationData)
                      annotationData = annotationData + '<field name="' + item + '"/> ' + '\n';
                    //  console.log('annotation data 2', annotationData)
                      for (let i = 0 ; i < index ; i++) {
                          annotationData = annotationData + '</field>' + '\n';
                         
                        }
                      //  console.log('annotation data 3', annotationData)
                    }  else {
                      for (let i = 0 ; i < index + 3 ; i++) {
                        annotationData = annotationData + '\t';
                      }
                      annotationData = annotationData + '<field name="' + item + '"> ' + '\n';
                      }
                  });
                  }
                  const ontologyString: string = annotation.ontology ?
                   '\t' + '\t' + '<ontology>' + '\n' + annotationData
                   +  '\t' + '\t' + '</ontology>' + '\n'
                  : '';
                
                  const textString: string = annotation.text !== '' ?
                   '\t' + '\t' + '<text>' + annotation.text + '</text>' + '\n'
                  : '';
                  data = data + '\t' + '<annotation startTime="' + annotation.startTime + '" ' 
                  + 'stopTime="' + annotation.stopTime + '" '  
                  + 'sequencing="' + annotation.sequencing + '"' + '>' + '\n'
                  + '\t' + '\t' + '<user>' + annotation.user.username + '</user>' + '\n'
                  + textString
                  + ontologyString
                  + '\t' + '</annotation>' + '\n';
                }
                 ) ;
                }
                  data = data + '</Project>';
            
                  var blob = new Blob([data], {type: 'text/xml'});
                  if (window.navigator.msSaveOrOpenBlob) {
                      window.navigator.msSaveBlob(blob, 'annotations_XML_' + project.shareName);
                  } else {
                      var elem = window.document.createElement('a');
                      elem.href = window.URL.createObjectURL(blob);
                      elem.download = 'annotations_XML_' + project.shareName + '.xml';        
                      document.body.appendChild(elem);
                      elem.click();        
                      document.body.removeChild(elem);
                    }
                  }
                }
            >
               {this.props.buttonName} XML
            </ButtonProgress>
                );
          }
        
      }));
  