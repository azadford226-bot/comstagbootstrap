package com.hivecontrolsolutions.comestag.base.core.usecase;

public interface UsecaseWithoutOutput<I> {

    void execute(I input);
}