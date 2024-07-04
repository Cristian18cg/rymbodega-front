import useControl from "../../hooks/useControl";
import FormularioLogin from "./formularioLogin";
import Home from "./home";
const Login = () => {
  const { isLoggedIn } = useControl();

  return <>{isLoggedIn === false ? <FormularioLogin /> : <Home />}</>;
};

export default Login;
