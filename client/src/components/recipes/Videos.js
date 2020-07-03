import React, { Component } from "react";
import { connect } from "react-redux";
import dotenv from "dotenv";
import { getVideos } from "../../actions/videoActions";

import LinearLoadingSymbol from "./loading/LinearLoadingSymbol";

dotenv.config()

class Videos extends Component {

  componentDidMount = () => {
    const videoData = {
      key: process.env.REACT_APP_API_KEY,
      channelID: 'UCExJR98eGcdssIRf9FlcGfQ',
      part: "id",
      maxResults: 10
    }
    this.props.getVideos(videoData);
  }

  render() {
    let content;
    const { videos, videosLoading } = this.props.videos;

    if (videos === null) { // Show hard-coded video embeds
      const videoIds = ['X_p6buR-JOo','jp1BX1Exnz8','KHS4tNKPfgI','TYl0E4DEqTI','VOE-W5AWaHw','CnHChzKOQt4'];
      content = videoIds.map(id => (
        <div style={{marginTop:"2rem", position:"relative",paddingBottom:"56.25%"}}><iframe style={{width:"100%",height:"100%",position:"absolute",left:0,top:0}} src={`https://www.youtube.com/embed/${id}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
      ));
    }
    else if (videosLoading || videos === undefined || videos.length === 0) {
      content = (<div style={{paddingTop:"5rem"}}><LinearLoadingSymbol /></div>)
    }
    else {
      content = videos.items.map(videoData => (
        <div style={{marginTop:"2rem", position:"relative",paddingBottom:"56.25%"}}><iframe style={{width:"100%",height:"100%",position:"absolute",left:0,top:0}} src={`https://www.youtube.com/embed/${videoData.id.videoId}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
      ))
    }
    return (
        <div className="center" style={{minHeight:"75vh", paddingBottom:"3rem"}}>
            <div className="yellow darken-4 white-text" style={{paddingTop:"2rem", paddingBottom:"2rem"}}>
                    <h4><b>Latest Videos</b></h4>
            </div>
            <div className="container">
              { content }
            </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  videos: state.videos
});

export default connect(
  mapStateToProps,
  { getVideos }
)(Videos);