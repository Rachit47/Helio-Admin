let transactionalData = [];

export const setTransactionalData = (data) => {
  transactionalData = data;
};

export const getTransactionalData = () => transactionalData;
