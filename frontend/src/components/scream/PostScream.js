import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import jwt_decode from "jwt-decode";
// Redux stuff
import { connect } from 'react-redux';
import { postShop, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
  ...theme.spreadThis,
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10
  },
  progressSpinner: {
    position: 'absolute'
  },
  closeButton: {
    position: 'absolute',
    left: '91%',
    top: '6%'
  }
});
var token_data = localStorage.getItem("access_token")
var user_data = jwt_decode(token_data)

class PostShop extends Component {
  state = {
    open: false,
    shop_name: '',
    // shop_logo: '',
    // shop_catagory: [],
    // shop_description: '',
    // shop_url: [''],
    
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '', open: false, errors: {} });
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postShop({ shop_name: this.state.shop_name, shop_description: this.state.shop_description, shop_logo: this.state.shop_logo, shop_description: this.state.shop_description, createdBy: user_data.id });
  };
  // render() {
  //   const {
  //     classes,
  //     user: {
  //       id,
  //       displayName,
  //       email,
  //       helpful,
  //       unhelpful,
  //       photoURL,
  //       createdAt,
  //       loading,
  //       authenticated
  //     }
  //   } = this.props;
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading },
    } = this.props;
    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip="Post a Scream!">
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>Create a new shop</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              
              <TextField
                name="shop_name"
                type="text"
                label="Shop Name"
                multiline
                rows="3"
                placeholder="shop name"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="shop_description"
                type="text"
                label="Shop Description"
                multiline
                rows="3"
                placeholder="shop description"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="shop_logo"
                type="text"
                label="Shop Logo URL"
                multiline
                rows="3"
                placeholder="shop log url"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="shop_url"
                type="text"
                label="Shop Logo URL"
                multiline
                rows="3"
                placeholder="shop url address"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostShop.propTypes = {
  postShop: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  user: state.user
});

export default connect(
  mapStateToProps,
  { postShop, clearErrors }
)(withStyles(styles)(PostShop));
