import { VideoUpdateData } from '@celluloid/types';
import {
  WithStyles,
  withStyles,
  Button,
  Snackbar,
  IconButton,
} from '@material-ui/core';
import * as React from 'react';
import { styles } from '../../ProjectStyles';
import CloseIcon from '@material-ui/icons/Close';
import { AsyncAction } from '../../../../types/ActionTypes';

interface Props extends WithStyles<typeof styles> {
  fieldName: string;
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
  projectid: string;
  updateDataMessage?: string;
  onClickValidate(projectId: string, data: VideoUpdateData): AsyncAction<VideoUpdateData, string>;
}

interface State {
    open: boolean;
} 

export default (withStyles(styles)(
    (
      class extends React.Component<Props, State> {
        state = {
           open: false
        } as State;

        render() {
            const { classes } = this.props;
            const handleOpen = () => {
                this.setState({open: true});
            };

            const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
            if (reason === 'clickaway') {
              return;
            }
            this.setState({open: false});
          };
            return (
            <div>
                <Button
                        onClick={ () => {
                          let updateData = {
                            dublin_title: this.props.title,
                            dublin_creator: this.props.creator,
                            dublin_subject: this.props.subject,
                            dublin_description: this.props.description,
                            dublin_contributor: this.props.contributor,
                            dublin_publisher: this.props.publisher,
                            dublin_date: this.props.date,
                            dublin_type: this.props.type,
                            dublin_format: this.props.format,
                            dublin_identifier: this.props.identifier,
                            dublin_source: this.props.source,
                            dublin_language: this.props.language,
                            dublin_relation: this.props.relation,
                            dublin_coverage: this.props.coverage,
                            dublin_rights: this.props.rights
                          } as  VideoUpdateData;
                          for (let key in updateData) {
                            if ( updateData[key] != null) {
                              updateData[key] = updateData[key].filter((word: string) => word !== '');
                              if ( updateData[key].length === 0) {
                                updateData[key] = null;
                              }
                            }
                          }
                          this.props.onClickValidate(this.props.projectid, updateData).then(() => {
                            if (this.props.updateDataMessage !== undefined) {
                                 handleOpen();
                            }
                        } );
                        }
                        }
                        variant="contained"
                        color="primary"
                        className={classes.datamenu}
                >
                        {this.props.fieldName}
                </Button> 
                <Snackbar
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          open={this.state.open}
                          autoHideDuration={4000}
                          onClose={handleClose}
                          message={this.props.updateDataMessage}
                          action={
                            <React.Fragment>
                              <IconButton aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </React.Fragment>
                          }
                /> 
            </div>
              );
        }
      
    }))); 
