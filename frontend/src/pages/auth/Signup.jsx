const Signup = () => {
  return (
    <div className="d-flex flex-column align-items-center text-white">
      <form autoComplete="off" noValidate>
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
          <div className="input-group">
            <input
              autoComplete="new-password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              style={{ width: '68px' }}
              className="btn border-start-0 show-password-hover"
            >
              Show
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="confirmPassword" className="form-label text-white">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              autoComplete="new-password"
              className="form-control border-success"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
            />
            <button
              style={{ width: '68px' }}
              type="button"
              className="btn show-password-hover border-start-0"
            >
              Show
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mb-1 text-center w-100">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
