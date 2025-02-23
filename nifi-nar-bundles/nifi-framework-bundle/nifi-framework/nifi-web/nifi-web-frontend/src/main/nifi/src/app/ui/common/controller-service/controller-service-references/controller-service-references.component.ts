/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input } from '@angular/core';
import {
    BulletinsTipInput,
    ControllerServiceReferencingComponent,
    ControllerServiceReferencingComponentEntity,
    ValidationErrorsTipInput
} from '../../../../state/shared';
import { NiFiCommon } from '../../../../service/nifi-common.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { NifiTooltipDirective } from '../../tooltips/nifi-tooltip.directive';
import { ValidationErrorsTip } from '../../tooltips/validation-errors-tip/validation-errors-tip.component';
import { BulletinsTip } from '../../tooltips/bulletins-tip/bulletins-tip.component';
import { RouterLink } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'controller-service-references',
    standalone: true,
    templateUrl: './controller-service-references.component.html',
    imports: [
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        NgIf,
        NgForOf,
        NgTemplateOutlet,
        NgClass,
        NifiTooltipDirective,
        RouterLink,
        MatDialogModule
    ],
    styleUrls: ['./controller-service-references.component.scss']
})
export class ControllerServiceReferences {
    @Input() serviceReferences!: ControllerServiceReferencingComponentEntity[];

    protected readonly ValidationErrorsTip = ValidationErrorsTip;
    protected readonly BulletinsTip = BulletinsTip;

    constructor(private nifiCommon: NiFiCommon) {}

    getUnauthorized(references: ControllerServiceReferencingComponentEntity[]) {
        return references.filter((reference) => !reference.permissions.canRead);
    }

    getReferencesByType(references: ControllerServiceReferencingComponentEntity[], referenceType: string) {
        return references.filter(
            (reference) => reference.permissions.canRead && reference.component.referenceType == referenceType
        );
    }

    isServiceInvalid(reference: ControllerServiceReferencingComponent): boolean {
        return reference.state == 'DISABLED' && !this.nifiCommon.isEmpty(reference.validationErrors);
    }

    isNonServiceInvalid(reference: ControllerServiceReferencingComponent): boolean {
        return reference.state == 'STOPPED' && !this.nifiCommon.isEmpty(reference.validationErrors);
    }

    getValidationErrorTipData(reference: ControllerServiceReferencingComponent): ValidationErrorsTipInput {
        return {
            isValidating: false,
            validationErrors: reference.validationErrors
        };
    }

    getNonServiceStateIcon(reference: ControllerServiceReferencingComponent): string {
        if (reference.state == 'STOPPED') {
            return 'fa fa-stop stopped';
        } else if (reference.state == 'RUNNING') {
            return 'fa fa-play running';
        } else {
            return 'icon icon-enable-false disabled';
        }
    }

    getServiceStateIcon(reference: ControllerServiceReferencingComponent): string {
        if (reference.state == 'ENABLED') {
            return 'enabled fa fa-flash';
        } else {
            return 'disabled icon icon-enable-false';
        }
    }

    getRouteForReference(reference: ControllerServiceReferencingComponent): string[] {
        if (reference.referenceType == 'ControllerService') {
            if (reference.groupId == null) {
                return ['/settings', 'management-controller-services', reference.id];
            } else {
                return ['/process-groups', reference.groupId, 'controller-services', reference.id];
            }
        } else if (reference.referenceType == 'ReportingTask') {
            return ['/settings', 'reporting-tasks', reference.id];
        } else if (reference.referenceType == 'Processor') {
            return ['/process-groups', reference.groupId, 'processors', reference.id];
        } else if (reference.referenceType == 'FlowAnalysisRule') {
            return ['/settings', 'flow-analysis-rules', reference.id];
        } else if (reference.referenceType == 'ParameterProvider') {
            return ['/settings', 'parameter-providers', reference.id];
        } else {
            return ['/settings', 'registry-clients', reference.id];
        }
    }

    hasBulletins(entity: ControllerServiceReferencingComponentEntity): boolean {
        return !this.nifiCommon.isEmpty(entity.bulletins);
    }

    getBulletinsTipData(entity: ControllerServiceReferencingComponentEntity): BulletinsTipInput {
        return {
            bulletins: entity.bulletins
        };
    }

    hasActiveThreads(reference: ControllerServiceReferencingComponent): boolean {
        return reference.activeThreadCount != null && reference.activeThreadCount > 0;
    }
}
