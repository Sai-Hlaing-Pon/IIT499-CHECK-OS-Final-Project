import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import IconButton from '@material-ui/core/IconButton';
// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import jwt_decode from "jwt-decode";
import { connect } from 'react-redux';
import { RateUser } from '../../redux/actions/dataActions';
// import axios from 'axios';

import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  SET_ERRORS,
  POST_SCREAM,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../../redux/types';

const axios = require('axios').default;
if (localStorage.getItem("access_token")){
  var token_data = localStorage.getItem("access_token")
  var user_data = jwt_decode(token_data)
  console.log("U-D: ", user_data.id)
}

const styles = theme => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: '50%'
  },
  commentData: {
    marginLeft: 20
  }
});

class Comments extends Component {
  toggle = (review_id, data) => {
    console.log("review_id: ", {"uid": user_data.id, "rate_type": "helpful"});
    this.props.RateUser(review_id, data);
    // axios
    //   .post(`/shop/${review_id}`, {"uid": user_data.id, "rate_type": "helpful"})
    //   .then((res) => {
    //     dispatch({
    //       type: SET_SCREAMS,
    //       payload: res.data
    //     });
    //   })
    //   .catch((err) => {
    //     dispatch({
    //       type: SET_SCREAMS,
    //       payload: []
    //     });
    //   });
    // let localLiked = this.state.liked;
  
    // Toggle the state variable liked
    // localLiked = !localLiked;
    // this.setState({ liked: localLiked });
  };
  render() {
    const { comments, classes } = this.props;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          console.log(comment);
          const { review_description, createdAt, createdByName, rating, helpful, unhelpful, id } = comment;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
                  {/* <Grid item sm={2}>
                    <img
                      src={photoURL}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid> */}
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${createdByName}`}
                        color="primary"
                      >
                        {createdByName}{"  "}
                      </Typography>
                      {/* <ThumbUpAltIcon type="submit" onClick={(id) => this.toggle(id)} />
                        <span>{helpful.length} Helpful</span>
                      <ThumbDownIcon type="submit" onClick={() => this.toggle(id)} />
                        <span>{unhelpful.length} Unhelpful</span> */}
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                      </Typography>
                      <LikeButton />
                        <span>{rating} Star rated</span>
                      <hr className={classes.invisibleSeparator} />
                      <Typography variabnt="body1">{review_description}</Typography>
                      <IconButton onClick={() => this.toggle(id, 
                        {"uid": user_data.id, "rate_type": "helpful"})}>
                          <ThumbUpAltIcon /><span>{helpful.length}</span>
                      </IconButton>
                      <IconButton onClick={() => this.toggle(id, 
                        {"uid": user_data.id, "rate_type": "unhelpful"})}>
                          <ThumbDownIcon /><span>{unhelpful.length}</span>
                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

export default connect(
  mapStateToProps,
  { RateUser }
)(withStyles(styles)(Comments));
