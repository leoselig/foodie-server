export default function catchValidationErrors(handler) {
  return async (request, response, next) => {
    try {
      console.log(error);
      return await handler(request, response, next);
    } catch (error) {
      console.log(error);
    }
  };
}
