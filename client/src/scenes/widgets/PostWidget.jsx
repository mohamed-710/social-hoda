import axios from "axios";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreHoriz,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const patchLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
        { userId: loggedInUserId },
        axiosConfig
      );
      dispatch(setPost({ post: response.data }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3001/posts/${postId}/comment`,
          { userId: loggedInUserId, comment: newComment },
          axiosConfig
        );
        dispatch(setPost({ post: response.data }));
        setNewComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleEditSubmit = async (commentId) => {
    if (editComment.trim()) {
      try {
        const response = await axios.patch(
          `http://localhost:3001/posts/${postId}/comment/${commentId}`,
          { userId: loggedInUserId, editComment },
          axiosConfig
        );
        dispatch(setPost({ post: response.data }));
        setEditCommentId(null);
        setEditComment("");
      } catch (error) {
        console.error("Error editing comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/posts/${postId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId: loggedInUserId },
        }
      );
      dispatch(setPost({ post: response.data }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setCurrentCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentCommentId(null);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "red" }} /> // Change to red when liked
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments((prev) => !prev)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Box key={comment.commentId}>
              <Divider />
              {editCommentId === comment.commentId ? (
                <Box
                  display="flex"
                  gap="0.5rem"
                  alignItems="center"
                  mt="0.5rem"
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "orange", // Change border color to orange
                        },
                        "&:hover fieldset": {
                          borderColor: "orange", // Change border color on hover to orange
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "orange", // Change border color when focused to orange
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "orange", // Change button background color to orange
                      "&:hover": {
                        backgroundColor: "darkorange", // Change hover color if needed
                      },
                    }}
                    onClick={() => handleEditSubmit(comment.commentId)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditCommentId(null)}
                    sx={{
                      borderColor: "#FFB74D", // Lighter orange for the initial state
                      color: "#FFB74D", // Lighter orange for the text
                      "&:hover": {
                        borderColor: "#FFCC80", // Even lighter orange on hover
                        color: "#FFCC80", // Match the text color on hover
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt="0.5rem"
                >
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.comment}
                  </Typography>
                  {comment.userId === loggedInUserId && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, comment.commentId)}
                    >
                      <MoreHoriz />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          ))}
          <Divider />
          <Box mt="1rem" display="flex" gap="0.5rem" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputLabelProps={{
                sx: {
                  color: "orange", // Change label color to orange
                  "&.Mui-focused": {
                    color: "orange", // Change label color when focused
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "orange", // Change border color to orange
                  },
                  "&:hover fieldset": {
                    borderColor: "orange", // Change border color on hover to orange
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "orange", // Change border color when focused to orange
                  },
                },
              }}
            />
            <IconButton
              sx={{
                color: "orange", // Change icon color to orange
              }}
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()} // Disable when input is empty
            >
              <Send sx={{ color: newComment.trim() ? "orange" : "grey" }} />{" "}
              {/* Change color when input is empty */}
            </IconButton>
          </Box>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentCommentId}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setEditCommentId(currentCommentId);
            setAnchorEl(null);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteComment(currentCommentId);
            setAnchorEl(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </WidgetWrapper>
  );
};

export default PostWidget;
