import {
  createStyles,
  Fade,
  FormHelperText,
  Input,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
  padded: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  unpadded: {
    paddingTop: theme.spacing.unit / 4,
    paddingBottom: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    borderRadius: 2,
    position: 'relative',
    transition: 'all 0.1s ease-out'
  },
  ok: {
    marginBottom: 0,
  },
  error: {
    marginBottom: theme.spacing.unit * 2
  },
  root: {
    fontSize: theme.typography.body1.fontSize,
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    color: 'inherit',
  },
  input: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    boxSizing: 'border-box'
  },
  inputHelper: {
    position: 'absolute',
    left: theme.spacing.unit,
    bottom: -theme.spacing.unit,
  },
  spanClass: {
    display: 'inline',
    width: '100px',
    height: '100px',
    padding: '5px',
  },
});

interface Props extends WithStyles<typeof styles> {
  error?: string;
  text: string;
  placeholder?: string;
  unpadded?: boolean;
  onChange(value: string): void;
}

export default withStyles(styles)(({
  classes,
  error,
  text,
  onChange,
  placeholder,
  unpadded
}: Props) => (
    <div
      className={classnames(
        error ? classes.error : classes.ok,
        classes.wrapper,
        unpadded ? classes.unpadded : classes.padded
      )}
    >
      <Input
        multiline={true}
        disableUnderline={true}
        autoFocus={true}
        placeholder={placeholder}
        classes={{
          root: classes.root,
          input: classes.input,
        }}
        value={text}
        error={Boolean(error)}
        fullWidth={true}
        onChange={event => onChange(event.target.value)}
      />
    
       
      <Fade in={Boolean(error)} appear={true}>
        <FormHelperText
          className={classes.inputHelper}
          error={true}
        >
          {error}
        </FormHelperText>
      </Fade>
    </div>
  ));