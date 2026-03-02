package com.hivecontrolsolutions.comestag.base.core.usecase;

public interface Usecase<I, O> {

    O execute(I input);
}