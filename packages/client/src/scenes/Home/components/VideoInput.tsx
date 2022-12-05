import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { withI18n, WithI18n } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { AppState } from 'types/StateTypes';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { IconButton, FormControlLabel, InputBase, LinearProgress } from '@material-ui/core';

const styles = ({ spacing, palette }: Theme) => createStyles({
    input : {
        display : 'none' 
    },
    form : {
        width: '80%',
        justifyContent : 'center'

    }
});

interface Props extends WithStyles<typeof styles>, WithI18n {
    player: string;
    newProjectVideoUrl: string;
    errors: {
        video?: string;
        projects?: string;
    };
    onTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFileName: string;
    uploadtime: number;
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
                let fileName = '';
                if ( this.props.selectedFileName.length > 30) {
                    fileName = this.props.selectedFileName.slice(0, 30) + '... '
                     + this.props.selectedFileName.substr(this.props.selectedFileName.lastIndexOf('.') + 1); 
                } else {
                    fileName = this.props.selectedFileName;
                }
                const { classes } = this.props;
                if (this.props.player) {
                    if (this.props.player === 'Peertube') {
                        return (
                            <TextField
                                style={{
                                width: 300
                                }}
                                variant="outlined"
                                placeholder={this.props.t('home.addVideo')}
                                onChange={this.props.onTextChange}
                                value={this.props.newProjectVideoUrl}
                                error={!!this.props.errors.video}
                            />
                        );
                    } else if (this.props.player === 'Local') {
                        return (
                                <div>
                                    <FormControlLabel
                                        value="start"
                                        className={classes.form}
                                        control={
                                            <div>
                                                <InputBase
                                                    type="file"
                                                    className={classes.input}
                                                    id="contained-button-file"
                                                    name="videoFile"
                                                    onChange={this.props.onVideoChange}
                                                    error={!!this.props.errors.video}
                                                /> 
                                                <label htmlFor="contained-button-file">
                                                <IconButton 
                                                    color="primary"
                                                    aria-label="upload picture" 
                                                    component="span"
                                                >
                                                    <CloudUploadIcon/>
                                                </IconButton>
                                                </label>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={this.props.uploadtime * 100}
                                                />
                                            </div>
                                        }
                                        label={fileName}
                                        placeholder={this.props.t('noFileSelected')}
                                        labelPlacement="end"
                                    />
                                </div>
                                
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