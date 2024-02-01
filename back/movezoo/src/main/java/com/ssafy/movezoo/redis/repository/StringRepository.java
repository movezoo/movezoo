package com.ssafy.movezoo.redis.repository;

import com.ssafy.movezoo.redis.entity.StringEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class StringRepository {
    private StringRedisTemplate redisCmds;
    private ValueOperations redisString;

    public StringRepository(StringRedisTemplate stringRedisTemplate) {
        this.redisCmds = stringRedisTemplate;
        this.redisString = stringRedisTemplate.opsForValue();
    }

    public void save(StringEntity stringEntity) {
        redisString.set(stringEntity.getKey(), stringEntity.getValue());
    }

    public StringEntity get(String key) {
        String value = (String) redisString.get(key);
        if (value == null) {
            log.info("value is null");
            return null;
        }
        return new StringEntity(key, value);
    }
}