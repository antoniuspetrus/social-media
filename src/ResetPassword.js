import { useEffect, useState } from "react";
import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import qs from "query-string";
import { Loader } from "./utils";
import { Button, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { updatePassword } from "firebase/auth";
import { getAuth } from "firebase/auth";

function ResetPassword(props) {
  const parsed = qs.parse(useLocation().search);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!parsed || !parsed.email || !parsed.token) {
      return;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const querySnapshot = await db
        .collection("forgot_password_links")
        .where("email", "==", parsed.email)
        .where("token", "==", parsed.token)
        .get();

      if (!querySnapshot.empty) {
        await db
          .collection("forgot_password_links")
          .doc(querySnapshot.docs[0].id)
          .update({ is_used: true });

        await updatePassword(getAuth().currentUser, password);

        window.location.href = "/login?reset_success=true";
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="login">
      <Loader visible={isLoading} />
      <h1>Forgot Password</h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <OutlinedInput
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <br />
        <OutlinedInput
          placeholder="Confirm Password"
          type={showPasswordConfirm ? "text" : "password"}
          autoComplete="off"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <br />

        <Button variant="contained" type="submit">Reset Password</Button>
      </form>
    </div>
  );
}

export default ResetPassword;
