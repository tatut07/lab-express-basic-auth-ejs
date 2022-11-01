const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 3;
      },
      message: (props) =>
        `You username is too short, only ${props.value.length} characters long`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
