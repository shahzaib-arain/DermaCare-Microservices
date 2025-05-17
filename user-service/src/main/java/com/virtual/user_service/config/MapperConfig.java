package com.virtual.user_service.config;
import com.virtual.user_service.model.User;
import com.virtual.user_service.dto.RegisterDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true);

        // Only keep simple mappings
        modelMapper.typeMap(RegisterDTO.class, User.class).addMappings(mapper -> {
            mapper.skip(User::setId);
            mapper.skip(User::setCreatedAt);
            mapper.skip(User::setVerified);
            mapper.skip(User::setActive);
            mapper.skip(User::setDoctorVerification);
        });

        return modelMapper;
    }
}