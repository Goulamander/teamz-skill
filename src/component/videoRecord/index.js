import React, {useState, useEffect} from 'react'
import VideoRecorder from 'react-video-recorder'

import noSupport from '../../assets/img/forbidden.png'
import Timer from './timer'

export default class VideoRecord extends React.Component {
    onTurnOnCamera = (action) => {
        action();
    }

    onTurnOnNativeCamera = (action) => {
        action();
    }

    onStartRecording = (action) => {
        action()
    }

    onStopRecording = (action) => {
        action.onStopRecording()
        setTimeout(() => {
            action.onStopReplaying()
            action.onTurnOffCamera()
        }, 1000)
    }

    nativeRecordingDone = (action) => {
        action.onTurnOnCamera()
    }

    render() {
        return(
            <div className="h-100">
                <div className="recording-view h-100">
                    <VideoRecorder 
                        onRecordingComplete={(videoBlob) => {
                            // console.log('videoBlob', source)
                            this.props.onRecordingComplete(videoBlob)
                        }}
                        renderLoadingView={() => {
                            return (
                                <div><h2>Loading</h2></div>
                            )
                        }}
                        renderDisconnectedView={() => (
                        <div>
                            <h2>Please allow your camera and microphones</h2>
                        </div>
                        )} 
                        renderActions={actions => {
                            let { isVideoInputSupported, isInlineRecordingSupported, thereWasAnError, isRecording, isCameraOn, streamIsReady, isConnecting, isReplayingVideo, isRunningCountdown, countdownTime } = actions

                            let shouldUseVideoInput = !isInlineRecordingSupported && isVideoInputSupported;

                            return (
                                <div>
                                    {(isCameraOn && !isConnecting && isRecording && !isRunningCountdown) &&
                                        <Timer timeLimit={this.props.vidoeLimit} onLimitComplete={() => this.onStopRecording(actions)} />
                                    }
                                    {(isCameraOn && !isConnecting && !isRecording && isRunningCountdown) &&
                                        <CountDownTime time={countdownTime} />
                                    }

                                    <div className="actions">
                                    {(!isInlineRecordingSupported && !isVideoInputSupported) &&
                                        (
                                            <div className="action">
                                                <img className="noSupport" src={noSupport} alt="Not Supported" />
                                            </div>
                                        )
                                    }
                                    {(shouldUseVideoInput && isReplayingVideo) &&
                                        (
                                            this.nativeRecordingDone(actions)
                                        )
                                    }
                                    {(shouldUseVideoInput && !isReplayingVideo) &&
                                        (
                                            <div className="action">
                                                <span className="action-text" onClick={() => this.onTurnOnNativeCamera(actions.onOpenVideoInput)}>Turn on device camera</span>
                                            </div>
                                        )
                                    }
                                    {(!isCameraOn && isInlineRecordingSupported && !isConnecting && !isReplayingVideo) &&
                                        (
                                            <div className="action">
                                                <span className="action-text" onClick={() => this.onTurnOnCamera(actions.onTurnOnCamera)}>Turn on camera</span>
                                            </div>
                                        )
                                    }
                                    {isConnecting &&
                                        (
                                            <div className="action">
                                                <span className="action-text">...</span>
                                            </div>
                                        )
                                    }
                                    {((isCameraOn || isReplayingVideo) && !isConnecting && !isRecording && !isRunningCountdown) &&
                                        (
                                            <div className="action">
                                                <span className="action-text" onClick={() => this.onStartRecording(actions.onStartRecording)}>Start Recording</span>
                                            </div>
                                        )
                                    }
                                    {(isCameraOn && !isConnecting && !isRecording && isRunningCountdown) &&
                                        (
                                            <div className="action">
                                            </div>
                                        )
                                    }
                                    {(isCameraOn && !isConnecting && isRecording && !isRunningCountdown) &&
                                        (
                                            <div className="action">
                                                <span className="action-text" onClick={() => this.onStopRecording(actions)}>Stop Recording</span>
                                            </div>
                                        )
                                    }
                                    </div>
                                </div>
                            )
                        }}
                    />
                </div>
            </div>
        )
    }
}

const CountDownTime = ({time}) => {
    const [count, setCount] = useState(time/1000)

    useEffect(() => {
     setTimeout(() => {
         if(count>1) {
            setCount(count-1)
         }
     }, 1000);   
    })

    return (
        <div className="countDownWrapper">
            {count}
        </div>
    )
}