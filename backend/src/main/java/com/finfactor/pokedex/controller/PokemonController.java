package com.finfactor.pokedex.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.finfactor.pokedex.service.PokemonService;

@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    @Autowired
    private PokemonService pokemonService;

    @GetMapping("/{name}")
    public String getPokemon(@PathVariable String name) {
        // you can add validation here if you want
        return pokemonService.getPokemon(name.toLowerCase());
    }
}