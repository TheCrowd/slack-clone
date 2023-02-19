import "./Message.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import Moment from "react-moment";
import "moment-timezone";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@material-ui/core";
import EmojiPicker from "emoji-picker-react";
import * as _ from "lodash";

function Message({ uid, name, avatar, message, timestamp }) {
  const [hovered, setHovered] = useState(false);
  const [reactionToggle, setReactionToggle] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const [reactions, setReactions] = useState([]);

  const MessageWidget = () => {
    useEffect(() => {
      if (!hovered) setReactionToggle(false);
    }, []);
    if (hovered) {
      return (
        <>
          <EmojiWidget />
          <div className="message__widget">
            <IconButton>
              <AddReactionOutlinedIcon
                onClick={() => {
                  setReactionToggle(!reactionToggle);
                }}
              />
            </IconButton>
            <IconButton>
              <CommentIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <IconButton>
              <BookmarkBorderIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  const EmojiWidget = () => {
    if (reactionToggle) {
      return (
        <div className="msg__widget__emoji__container">
          <EmojiPicker
            onEmojiClick={(emojiData, event) => {
              onEmojiClick(event, emojiData);
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const reactionCountPairs = reactions.reduce((acc, curr) => {
    if (acc[curr]) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }
    return acc;
  }, {});

  const reactionGroups = reactions.reduce((groups, reaction) => {
    const index = groups.findIndex((group) => {
      return group.length > 0 && group[0].unified === reaction.unified;
    });
    if (index === -1) {
      groups.push([reaction]);
    } else {
      groups[index].push(reaction);
    }
    return groups;
  }, []);
  const ReactionBar = () => {
    return (
      <div className="reaction__bar">
        {reactionGroups.map((reactionGroup) => {
          return (
            <div
              className="reaction__bar__item"
              onClick={() => {
                console.log([...reactions, _.cloneDeep(reactionGroup[0])]);
                setReactions([...reactions, _.cloneDeep(reactionGroup[0])]);
              }}
            >
              <img
                src={reactionGroup[0].getImageUrl()}
                alt={reactionGroup[0].names[0]}
                className="emoji__img"
              />
              <span>{reactionGroup.length}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const onEmojiClick = (event, emojiObject) => {
    setReactions([...reactions, emojiObject]);
  };
  // Moment.globalTimezone = 'America/Los_Angeles'

  return (
    <div>
      <div
        className="message"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <div className="message__data">
          <div className="message__left">
            <Avatar
              className="message__avatar"
              src={avatar}
              alt={`${name} ${uid} - Image`}
            />
          </div>
          <div className="message__right">
            <div className="message__details">
              <Link to={`/users/${uid}`}>{name}</Link>
              <small>
                <Moment
                  className="message__sent__time"
                  unix
                  date={timestamp}
                  format=" hh:mm A"
                />
              </small>
            </div>
            <p className="message__text">{message}</p>
          </div>
        </div>
        <MessageWidget />
      </div>
      <ReactionBar />
    </div>
  );
}

export default Message;
