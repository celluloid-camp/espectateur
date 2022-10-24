import { createStyles, Theme } from '@material-ui/core/styles';

export const styles = ({ palette, spacing }: Theme) => createStyles({
  root: {
    minHeight: 'calc(100vh - 64px)'
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    textAlign: 'center' as 'center',
    backgroundColor: palette.grey['900']
  },
  video: {
    height: '100%',
    maxWidth: 1024,
    margin: '0 auto',
  },
  content: {
    padding: spacing.unit * 3,
    minHeight: 'calc(100% - 64px)',
    maxWidth: 1024,
    margin: '0 auto'
  },
  tag: {
    margin: 4,
    float: 'right'
  },
  sideBar: {
    textAlign: 'left'
  },
  divider: {
    margin: '50px'
  },
  datamenu: {
    width: '100%',
    margin: '10px'
  },
  dataicon: {
    marginRight : '10px'
  },
  import: {
    marginTop: '80px',
    fontSize: '8px',
    height: '15%'
  },
  input: {
    display: 'none'
  },
  submenu: {
    width: '100%',
    marginTop: '10px'
  },
  addFieldButton: {
    marginBottom: '10px'
  },
  dataItem: {
    marginBottom: '10px'
  },
  dataField: {
    marginBottom: '30px',
    marginTop: '30px'
  }
});