import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/scream/Scream';
import jwt_decode from "jwt-decode";
// import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';
// import ScreamSkeleton from '../util/ScreamSkeleton';

// import { connect } from 'react-redux';
// import { getScreams } from '../redux/actions/dataActions';
const axios = require('axios').default;
if (localStorage.getItem("access_token")){
  var token_data = localStorage.getItem("access_token")
  var user_data = jwt_decode(token_data)
  console.log("U-D: ", user_data.id)
}
class home extends Component {
    state = {
        shop: null
    }
  componentDidMount() {
    axios.get('/shop')
        .then(res => {
            console.log(res.data)
            this.setState({
                shop: res.data
            })
        })
        .catch(err=> console.log(err));
  }
  render() {
      let recentShopMarkup = this.state.shop ? (
          this.state.shop.map((shop) => <Scream key={shop.id} shop={shop} />)
      ) : <p>Loading...</p>
    // const { screams, loading } = this.props.data;
    // let recentScreamsMarkup = !loading ? (
    //   screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    // ) : (
    //   <ScreamSkeleton />
    // );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {recentShopMarkup}
        </Grid>
        &nbsp;
        <Grid item sm={3} xs={8}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

// home.propTypes = {
//   getScreams: PropTypes.func.isRequired,
//   data: PropTypes.object.isRequired
// };

// const mapStateToProps = (state) => ({
//   data: state.data
// });

// export default connect(
//   mapStateToProps,
//   { getScreams }
// )(home);
export default home;