// Login User
export interface LoginForm {
  email:    string;
  password: string;
};

// Register User
export interface RegisterForm {
  username:   string,
  email:      string;
  password:   string;
  avatarUrl?: string;
  roles:      string
};

// New Post 
export interface NewPostForm {
  title:       string;
  content:     string;
  slug:        string;
  status:      string;
  category:    string;
  tagIds?:     string []
};

// New Comment
export interface CommentForm {
  content: string;
  author: string;
};

// Reply 
export interface ReplyForm {
  content: string;
  author: string;
};

// Edit Post
export interface EditPostForm {
  title: string;
  text: string;
  category: string;
};
