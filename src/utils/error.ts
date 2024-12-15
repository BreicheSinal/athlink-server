interface ThrowErrorParams {
  message: string;
  res: {
    status: (statusCode: number) => {
      send: (body: object) => void;
    };
  };
  status?: number;
}

interface ThrowNotFoundParams {
  entity: string;
  check?: boolean;
  res: {
    status: (statusCode: number) => {
      send: (body: object) => void;
    };
  };
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

export const throwNotFound = ({
  entity,
  check = true,
  res,
}: ThrowNotFoundParams): void => {
  if (check) {
    res.status(404).send({
      message: `${entity} Not found`,
    });
  }
};
