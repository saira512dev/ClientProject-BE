import passport from "passport";
import validator from "validator";
import User from "../models/User.js";

export const postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    const errors = validationErrors.reduce((acc, err) => acc + `${err.msg}, `, "");
    res.send({ error: errors.slice(0, -2) });
    return;
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({ error: "Invalid user/password" });
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json(req.user);
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  console.log(req.user)
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
  });
  req.logout(() => {
    console.log("User has logged out.");
    res.clearCookie("connect.sid", { path: "/" });
    res.send("logged out");
  })
};


export const test = (req, res) => {
  res.json("CONNECTED")
  return;
};

export const postSignup = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

  if (validationErrors.length) {
    const errors = validationErrors.reduce((acc, err) => acc + `${err.msg}, `, "");
    res.send({ error: errors.slice(0, -2) });
    return;
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phone,
    occupation: req.body.occupation,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    role: "user"
  })
  console.log(user)
  User.findOne({email: req.body.email}, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      res.send({ error:  'Account with that email address or username already exists.'});
      return;
    }

    user.save((err) => {
      if (err) { return next(err) }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
      res.json(user);
      })
    })
   })
}

