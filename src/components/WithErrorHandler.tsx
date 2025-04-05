import React from 'react';
import type { PropsWithChildren } from 'react';
import type { ErrorRouteComponent, NotFoundRouteComponent } from '@tanstack/react-router';

interface Props {
  notFoundComponent?: NotFoundRouteComponent;
  errorComponent?: ErrorRouteComponent | false | null;
  error: Error & { isNotFound: boolean } | null;
}
export function WithErrorHandler({
  children,
  error,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
}: PropsWithChildren<Props>) {
  if (error) {
    if (error.isNotFound) {
      return NotFoundComponent ? <NotFoundComponent data={{}} /> : null;
    }
    return ErrorComponent ? <ErrorComponent reset={() => {}} error={error} /> : null;
  }
  return children
}
