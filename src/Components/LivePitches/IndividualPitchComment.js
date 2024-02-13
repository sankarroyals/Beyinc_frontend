import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { format } from 'timeago.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'

const IndividualPitchComment = ({ c, deleteComment, setPitchTrigger, pitchTrigger, parentCommentId }) => {
  const { email, user_id } = useSelector(state => state.auth.loginDetails)
  const { pitchId } = useParams()
  const [comment, setComment] = useState('')
  const [replyBox, setReplyBox] = useState(false)
  const [subCommentOpen, setSubCommentOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const addSubComment = async () => {
    setReplyBox(!replyBox)
    setComment('')
    await ApiServices.addPitchComment({
      pitchId: pitchId,
      commentBy: user_id, comment: comment, parentCommentId: c._id,
    })
      .then((res) => {
        setPitchTrigger(!pitchTrigger)
        setComment("");
      })
      .catch((err) => {
        navigate("/livePitches");
      });
  };

  return (
    <><div className='IndicommentsSection'>
      <div className='IndicommentsSectionImage'>
        <img src={(c?.profile_pic || c?.commentBy?.image?.url) || '/profile.jpeg'} alt="" />
      </div>
      <div className='IndicommentsSectionDetails'>
        <div className='IndicommentsSectionDetailsUserName'>
          <div title={(c?.email || c?.commentBy?.email)}>{(c?.userName || c?.commentBy?.userName)}

          </div>
          <div style={{ fontWeight: '200' }} title={(c?.email || c?.commentBy?.email)} className='IndicommentsSectionDetailsdate'>
            {format(c?.createdAt)}
          </div>
          {/* <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{(c?.email || c?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
        </div>
        <div title={(c?.email || c?.commentBy?.email)} className='IndicommentsSectionDetailscomment'>
          {c?.comment}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '5px' }}>
          <div>
            <i
              class="far fa-thumbs-up"
              aria-hidden="true" />
          </div>
          <div>
            <i
              class="far fa-thumbs-down"
              aria-hidden="true" />
          </div>

          <div>
            <span className='replyTag' onClick={() => { setReplyBox(!replyBox) }}>Reply</span>
          </div>
        </div>

        


        {c.subComments?.length > 0 &&
          <div className='totalSubComments' onClick={() => setSubCommentOpen(!subCommentOpen)}>
            <div>
              <i class={`fas ${subCommentOpen ? 'fa-caret-down' :'fa-caret-right'}`}></i>
            </div>
            <div>{c.subComments?.length} replies</div>
          </div>}

      </div>


    </div>
      <div className="subcommentsContainer">

        {subCommentOpen && c.subComments?.length > 0 &&
          c.subComments?.map(cs => (
            <div className='IndicommentsSection'>
              <div className='IndicommentsSectionImage'>
                <img src={(cs?.profile_pic || cs?.commentBy?.image?.url) || '/profile.jpeg'} alt="" />
              </div>
              <div className='IndicommentsSectionDetails'>
                <div className='IndicommentsSectionDetailsUserName'>
                  <div title={(cs?.email || cs?.commentBy?.email)}>{(cs?.userName || cs?.commentBy?.userName)}

                  </div>
                  <div style={{ fontWeight: '200' }} title={(cs?.email || cs?.commentBy?.email)} className='IndicommentsSectionDetailsdate'>
                    {format(cs?.createdAt)}
                  </div>
                  {/* <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{(cs?.email || cs?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
                </div>
                <div title={(cs?.email || cs?.commentBy?.email)} className='IndicommentsSectionDetailscomment'>
                  {cs?.comment}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '5px' }}>
                  <div>
                    <i
                      class="far fa-thumbs-up"
                      aria-hidden="true" />
                  </div>
                  <div>
                    <i
                      class="far fa-thumbs-down"
                      aria-hidden="true" />
                  </div>

                  <div>
                    <span className='replyTag' onClick={() => { setReplyBox(!replyBox) }}>Reply</span>
                  </div>
                </div>
              </div>


            </div>
          ))}
      </div>
      {replyBox && <div
        className="writing-review"
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div>
          <textarea
            className="textarea"
            rows={2}
            cols={50}
            value={comment} onChange={(e) => { setComment(e.target.value) }}
            placeholder="Describe Your Experience"
            style={{ resize: 'none' }} />
        </div>
        <div>
          <button
            onClick={addSubComment}
            className="sendIcon"
            style={{
              cursor: comment == "" ? "not-allowed" : "pointer",
              fontSize: "13px",
              padding: "10px",
            }}
          >
            Post Review
          </button>
        </div>
      </div>}
    </>

  )
}

export default IndividualPitchComment