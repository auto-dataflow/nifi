/*
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Counters } from './counters.component';
import { CountersRoutingModule } from './counters-routing.module';
import { StoreModule } from '@ngrx/store';
import { countersFeatureKey, reducers } from '../state';
import { EffectsModule } from '@ngrx/effects';
import { CounterListingEffects } from '../state/counter-listing/counter-listing.effects';
import { CounterListingModule } from '../ui/counter-listing/counter-listing.module';
import { ParameterContextListingModule } from '../../parameter-contexts/ui/parameter-context-listing/parameter-context-listing.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [Counters],
    exports: [Counters],
    imports: [
        CommonModule,
        CountersRoutingModule,
        StoreModule.forFeature(countersFeatureKey, reducers),
        EffectsModule.forFeature(CounterListingEffects),
        CounterListingModule,
        ParameterContextListingModule,
        MatDialogModule
    ]
})
export class CountersModule {}
