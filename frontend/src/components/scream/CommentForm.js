import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import jwt_decode from "jwt-decode";

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
// MUI Stuff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Redux stuff
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';
const axios = require('axios').default;
if (localStorage.getItem("access_token")){
  var token_data = localStorage.getItem("access_token")
  var user_data = jwt_decode(token_data)
  console.log("U-D: ", user_data.id)
}
const styles = theme => ({
  ...theme.spreadThis
});

class CommentForm extends Component {
  state = {
    body: '',
    rating: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '' });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { 
      rating: this.state.rating, 
      review_description: this.state.review_description, 
      createdBy: user_data.id, 
      createdByName: user_data.displayName 
    });
  };

  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: 'center' }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="review_description"
            type="text"
            label="Description"
            multiline
            rows="3"
            placeholder="write review"
            error={errors.body ? true : false}
            helperText={errors.body}
            className={classes.textField}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            name="rating"
            type="text"
            label="Rate"
            multiline
            rows="3"
            placeholder="rate between 0-5"
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
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

export default connect(
  mapStateToProps,
  { submitComment }
)(withStyles(styles)(CommentForm));
