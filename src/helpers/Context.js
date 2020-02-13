import React, { createContext } from 'react';

const ServiceContext = createContext();

export const ServiceProvider = ServiceContext.Provider;

export const ServiceConsumer = ServiceContext.Consumer;
