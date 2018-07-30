package com.mealplanner.function;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.mealplanner.dal.MealRepository;
import com.mealplanner.domain.Meal;
import com.mealplanner.function.util.ApiGatewayRequest;
import com.serverless.ApiGatewayResponse;

public class ListMealsHandler implements RequestHandler<ApiGatewayRequest, ApiGatewayResponse> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ListMealsHandler.class);

    @Override
    public ApiGatewayResponse handleRequest(final ApiGatewayRequest request, final Context context) {
        try {
            final String userId = request.getRequestContext().getIdentity().getCognitoIdentityId();
            final MealRepository repository = new MealRepository();
            final List<Meal> meals = repository.getAllMealsForUser(userId);

            final Map<String, String> newHeaders = new HashMap<>();
            newHeaders.put("Access-Control-Allow-Origin", "*");
            return ApiGatewayResponse.builder()
                    .setStatusCode(200)
                    .setHeaders(newHeaders)
                    .setObjectBody(meals)
                    .build();
        } catch (final Exception e) {
            final String errorText = String.format("Error retrieving meal with request [%s]", request);
            LOGGER.error(errorText, e);
            return ApiGatewayResponse.builder()
                    .setStatusCode(500)
                    .setObjectBody(errorText)
                    .build();
        }
    }
}
