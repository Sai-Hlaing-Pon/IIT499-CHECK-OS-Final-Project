import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// MUI Stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
// Redux stuff
import { connect } from 'react-redux';
import { getShop, clearErrors } from '../../redux/actions/dataActions';

const axios = require('axios').default;
const styles = theme => ({
  ...theme.spreadThis,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: 'absolute',
    left: '90%'
  },
  expandButton: {
    position: 'absolute',
    left: '90%'
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  }
});

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: '',
    newPath: '',
    shop_name: null,
    shop_rating: null,
    shop_logo: null,
    shop_description: null,
    shop_reviews: [],
    shop_issues: [],
    id: null,
    createdAt: null,
    shop_url: null
  };
  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }
  handleOpen = () => {
    this.setState({open: true})
    // let oldPath = window.location.pathname;

    // const { userHandle, screamId } = this.props;
    // const newPath = `/users/${userHandle}/scream/${screamId}`;

    // if (oldPath === newPath) oldPath = `/users/${userHandle}`;

    // window.history.pushState(null, null, newPath);

    // this.setState({ open: true, oldPath, newPath });
    // this.props.getScream(this.props.screamId);
    axios.get(`/shop/${this.props.screamId}`)
        .then(res => {
            console.log(res.data.data[0])
            this.setState({
                shop_name: res.data.data[0].shop_name,
                shop_rating: res.data.data[0].shop_rating,
                shop_logo: res.data.data[0].shop_logo,
                shop_description: res.data.data[0].shop_description,
                shop_reviews: res.data.data[0].shop_reviews,
                shop_issues: res.data.data[0].shop_issues,
                id: res.data.data[0].id,
                createdAt: res.data.data[0].createdAt,
                shop_url: res.data.data[0].shop_url
            })
        })
        .catch(err=> console.log(err));
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };

  render() {
    console.log("shop: ", this.state.shop);
    const {
      classes,
      scream: {
        id,
        shop_name,
        shop_description,
        createdAt,
        shop_rating,
        shop_reviews,
        shop_issues,
        shop_logo,
        shop_url
      },
      UI: { loading }
    } = this.props;

  //   let recentShopMarkup = this.state.shop ? (
  //     this.state.shop_reviews.map((shop_review) => <Comments key={shop.id} shop={shop} />)
  // ) : <p>Loading...</p>

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={this.state.shop_logo} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            // component={Link}
            color="primary"
            variant="h5"
            // to={`/users/${userHandle}`}
          >
            @{this.state.shop_name}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(this.state.createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{this.state.shop_description}</Typography>
          <LikeButton screamId={this.state.id} />
          <span>{this.state.shop_rating} rating point</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{this.state.shop_reviews.length} comments</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm screamId={this.state.id} />
        <Comments comments={this.state.shop_reviews} />
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
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
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = {
  getShop,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
