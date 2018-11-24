import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react'

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Video extends Component {
  constructor(props) {
    super(props)
    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source')
      },
      streamCreated: () => {
        console.log('Publisher stream created')
      },
      streamDestroyed: ({ reason }) => {
        console.log(`Publisher stream destroyed because: ${reason}`)
      }
    }
    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('SUBSCRIBER VIDEO ENABLED')
      },
      videoDisabled: () => {
        console.log('SUBSCRIBER VIDEO DISABLED')
      }
    }
  }

  render() {
    console.log(this.props.video)
    return (
      <div className="individual-video">
        <OTSession
          apiKey="46223602"
          sessionId={this.props.video.sessionId}
          token={this.props.video.sessionKey}
        >
          <OTPublisher
            properties={{
              publishVideo: true,
              width: 150,
              height: 150,
              name: this.props.user.userName
            }}
            onPublish={() => console.log('SUCCESSFULLY PUBLISHED')}
            onError={() => console.log('ERROR OCCURED DURING PUBLISH')}
            eventHandlers={this.publisherEventHandlers}
          />
          <OTStreams>
            <OTSubscriber
              properties={{
                subscribeToAudio: true,
                subscribeToVideo: true,
                width: 150,
                height: 150,
                name: this.props.user.userName
              }}
              onSubscribe={() => console.log('SUCCESSFULLY SUBSCRIBED')}
              onSubscribeError={() =>
                console.log('ERROR OCCURED DURING SUBSCRIBE')
              }
              eventHandlers={this.subscriberEventHandlers}
            />
          </OTStreams>
        </OTSession>
      </div>
    )
  }
}
const mapState = state => ({
  user: state.user,
  game: state.game,
  video: state.video
})
export default connect(
  mapState,
  null
)(Video)
