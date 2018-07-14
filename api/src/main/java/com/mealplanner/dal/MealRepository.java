package com.mealplanner.dal;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedQueryList;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.mealplanner.domain.Meal;

public class MealRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(MealRepository.class);
    private static final String MEALS_TABLE_NAME = System.getenv("tableName");

    private final DynamoDBMapper mapper;

    public MealRepository() {
        LOGGER.info("MEALS_TABLE_NAME value: [{}]", MEALS_TABLE_NAME);

        final DynamoDBMapperConfig mapperConfig = DynamoDBMapperConfig.builder()
                .withTableNameOverride(new DynamoDBMapperConfig.TableNameOverride(MEALS_TABLE_NAME))
                .build();

        this.mapper = DynamoDbAdapter.getInstance().createDbMapper(mapperConfig);
    }

    public Meal get(final String id) {
        final Map<String, AttributeValue> attributeValues = new HashMap<>();
        attributeValues.put(":v1", new AttributeValue().withS(id));

        final DynamoDBQueryExpression<Meal> queryExpression = new DynamoDBQueryExpression<Meal>()
                .withKeyConditionExpression("mealId = :v1")
                .withExpressionAttributeValues(attributeValues);

        final PaginatedQueryList<Meal> result = mapper.query(Meal.class, queryExpression);
        if (result.size() == 1) {
            return result.get(0);
        } else if (result.size() == 0) {
            throw new IllegalStateException(String.format("No Meal found for ID [%s]", id));
        } else {
            throw new IllegalStateException(String.format("Multiple Meals found for ID [%s]", id));
        }
    }

    public void save(final Meal meal) {
        LOGGER.info("Saving meal [{}]", meal);
        mapper.save(meal);
    }
}