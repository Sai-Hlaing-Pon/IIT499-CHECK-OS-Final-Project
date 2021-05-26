import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';
// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Scream extends Component {
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      shop: {
        shop_name,
        shop_logo,
        shop_description,
        shop_url,
        shop_catagory,
        createdAt,   
        id,
        shop_rating,
        shop_reviews,
      },
      user: {
        authenticated,
        displayName
      }
    } = this.props;

    const deleteButton =
      authenticated && shop_name === displayName ? (
        <DeleteScream shopId={id} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={shop_logo}
          title="Shop Logo"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"           
            color="primary"
          >
           
           {shop_name}
       
   
          </Typography>
          <LikeButton shopId={id} />
          <span>{shop_rating} Rating points</span>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {shop_catagory}
          </Typography>
          <Typography variant="body1">{shop_description}</Typography>
          <Typography variant="body1">website: {shop_url}</Typography>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{shop_reviews.length} comments</span>
          <ScreamDialog
            screamId={id}
            shopName={shop_name}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
