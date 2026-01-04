const Login = () => {
  return (
    <div className="d-flex flex-column align-items-center w-100">
      <form autoComplete="off" noValidate className="w-100">
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            autoComplete="off"
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label text-white">
            Password <span className="text-danger">*</span>
          </label>
          <div className="input-group mb-4">
            <input
              autoComplete="new-password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
            <button type="button" className="btn show-password-hover border-start-0 text-white">
              Show
            </button>
          </div>
        </div>

        <button className="btn btn-primary mb-4 w-100">
          <span>Login</span>
        </button>
      </form>

      <button type="button" className="btn btn-primary mb-4 w-100 text-center">
        Get Guest User Credentials
      </button>
    </div>
  );
};
export default Login;
