interface ThrowErrorParams {
  message: string;
  res: {
    status: (statusCode: number) => {
      send: (body: object) => void;
    };
  };
  status?: number;
}

export const throwError = ({
  message,
  res,
  status = 500,
}: ThrowErrorParams): void => {
  res.status(status).send({
    message: message || "Internal Server Error",
  });
};
