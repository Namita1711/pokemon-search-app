package com.finfactor.pokedex.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PokemonService {

    @Cacheable("pokemon")
    public String getPokemon(String name) {
        String url = "https://pokeapi.co/api/v2/pokemon/" + name;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }
}