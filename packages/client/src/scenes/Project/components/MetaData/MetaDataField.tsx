import { ProjectGraphRecord } from '@celluloid/types';
import {
  Grid,
  WithStyles,
  withStyles,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core';
import * as React from 'react';
import { styles } from '../../ProjectStyles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

interface Props extends WithStyles<typeof styles> {
  field: string;
  label?: string;
  project?: ProjectGraphRecord;
  value: string[]|null;
  onAdd(key: string, value: string): void ;
  onClose(key: string, nb: number): void ;
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void ;
}

export default (withStyles(styles)(
    (
      class extends React.Component<Props> {
    
        render() {
            const { classes } = this.props;
            const value = this.props.value ? this.props.value : [''];
            return (
              <Grid item={true} xs={6} md={6} lg={6} className={classes.dataField}>
                <Typography
                      className={classes.submenu}
                      align="left"
                      gutterBottom={true}
                      variant="h6"
                      color="primary"
                >
                    {this.props.label}
                </Typography>
                 {
                      value.map((item, index) => {
                      return (
                        <TextField
                          className={classes.dataItem}
                          variant="outlined"
                          fullWidth={true}
                          key={this.props.field + index}
                          onChange={this.props.onChange}
                          name={this.props.field + index}
                          value={item}
                          InputProps={{
                            endAdornment: 
                                            <IconButton
                                             aria-label="close" 
                                             color="inherit" 
                                             onClick={
                                              () => this.props.onClose(this.props.field, index)
                                              }
                                            >
                                              <RemoveIcon fontSize="small" />
                                            </IconButton>
                                          
                          }}
                        />
                        );
                      })     
                  }
                     <IconButton 
                      aria-label="close" 
                      color="inherit" 
                      onClick={() => this.props.onAdd(this.props.field, '')}
                     >
                       <AddIcon fontSize="small" />
                     </IconButton>
              </Grid>
              );
        }
      
    })));