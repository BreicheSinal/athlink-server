interface ThrowErrorParams {
  message: string;
  res: {
    status: (statusCode: number) => {
      send: (body: object) => void;
    };
  };
  status?: number;
  details?: any;
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
  details,
}: ThrowErrorParams): void => {
  res.status(status).send({
    message: message || "Internal Server Error",
    details: details || null,
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
